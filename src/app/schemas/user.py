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

    class ConfigDict:
        from_attributes = True #lets pydantic read sqlalchemy model attributes

class UserLogin(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

"""
#Ive decided to roll my own sudoku later
class SudokuClue(BaseModel):
    pos: int # 0-80
    num: int # 1-9

class SudokuResponse(BaseModel):
    daily_puzzle: list[SudokuClue]

"""
