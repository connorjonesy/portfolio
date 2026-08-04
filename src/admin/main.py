import os
from typing import List  #Python module

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import TokenResponse, UserCreate, UserLogin, UserResponse
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

