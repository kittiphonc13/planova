from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from pathlib import Path

# Create the database directory if it doesn't exist
DB_DIR = Path(__file__).parent.parent.parent / "data"
DB_DIR.mkdir(exist_ok=True)

# Database URL
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_DIR}/planova.db"

# Create engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()


def get_db():
    """
    Dependency for getting DB session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
