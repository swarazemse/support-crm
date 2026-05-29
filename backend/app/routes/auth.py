from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..models import User

router = APIRouter()

# Database Dependency
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.post("/login")
def login(data: dict, db: Session = Depends(get_db)):

    username = data.get("username")

    password = data.get("password")

    if not username or not password:

        raise HTTPException(
            status_code=400,
            detail="Username and password required"
        )

    user = db.query(User).filter(
        User.username == username
    ).first()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid username"
        )

    if user.password != password:

        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    return {
        "success": True,
        "username": user.username
    }