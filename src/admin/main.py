import os
import random
from typing import List  #Python module

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import TokenResponse, UserCreate, UserLogin, UserResponse, SudokuResponse
from app.security.security import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from shared.database import get_db

app = FastAPI()

origins = os.environ.get("ALLOWED_ORIGINS", "").split(",")
app.add_middleware(
        CORSMiddleware, 
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        )

@app.get("/health")
def health():
    return {"status": "ok"}

"""
* response=UserResponse strips pw out of the response. FastAPI serializes the returned SQLAlchemy User object
thru that schema, dropping any field not declared to it
* db.rollback() is important after a failed commit, so the session doesnt stay in a bad state after failed reqs
"""
@app.post("/users", response_model=UserResponse, status_code=201)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hash_password(user.password),
    )
    db.add(db_user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="User already exists")

    db.refresh(db_user)
    return db_user

@app.get("/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@app.get("/users/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/users/{id}", response_model=List[UserResponse])
def get_user(id: int, db: Session = Depends(get_db)):
    '''
    We use first here bc sqlalchemy query returns a query object, not a row. 
    So we choose to get the first row (should only be 1 row anyway)
    and it returns None if no id match
    '''
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/auth/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    '''
    sub in the token payload -- subject is the standard JWT claim for id who the token belongs to
    '''
    user = db.query(User).filter(User.username == credentials.username).first()
    if not user or not verify_password(credentials.password, str(user.hashed_password)):
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

"""
For now ill generate this each time because im curious how long the alg will take
Future todo will be to store in the DB, create a GEN puzzle endpoint that gets called by
the js once every morning, and then the fetch puzzle will simply grab it from the db
"""
@app.get("/sudoku/daily", response_model=SudokuResponse)
def get_puzzle():
    verify_positions = False
    positions = generate_positions() #26 KV pairs, numbers all 0 atm
    while (verify_positions == False):
        for position in positions:
            position["num"] = random.randint(1,9)
        verify_positions = verify_puzzle(positions) #TODO
        if not verify_positions:
            positions = generate_positions() #26 KV pairs, numbers all 0 atm

    return positions

def generate_positions():
    positions = [] #KV pairs
    for i in range(26):
        newpos = {"pos": random.randint(0,80), "num": 0}
        positions[i] = newpos
    return positions

def verify_puzzle(positions):
    pos_data = []
    i = 0
    for position in positions:
            row = position["pos"] // 9
            col = position["pos"] % 9
            box = (row // 3) * 3 + (col // 3)
            num = position["num"]
            pos_data[i] = [row,col,box,num]
            i+=1
    #compare - nested for loop
    for i in range(len(pos_data)):
        for j in range(i + 1, len(pos_data)):
            if(pos_data[i][3] == pos_data[j][3]):
                return False
    return True
