from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from shared.database import Base

class User(Base):
    """
    SQLAlchemy model - reps the users table in the db
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    #server default - the DB sets the value when a row is inserted, not python
