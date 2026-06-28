from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate, UserResponse
from app.models.user import User
from app.security.security import hash_password
from shared.database import get_db
from typing import List #Python module

app = FastAPI()

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
