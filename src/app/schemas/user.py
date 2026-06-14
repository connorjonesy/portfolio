from pydantic import BaseModel

class UserCreate(BaseModel):
    """What the API expects when creating a user"""
    username: str
    email: str
    password: str #plain text comin in, gets hashed before hitting db

class UserResponse(BaseModel):
    """What the API returns - NOTE no pw field"""
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True #lets pydantic read sqlalchemy model attributes
