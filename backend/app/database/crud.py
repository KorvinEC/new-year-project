from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from . import models, schemas
from core.security import get_password_hash


def get_user(db: Session, user_id: int):
    user = db.query(
        models.Users
        .filter(models.Users.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(status_code=404, detail="Users not found")
    return user


def get_user_by_username(db: Session, username: str) -> schemas.UserBase:
    return db.query(models.Users) \
        .filter(models.Users.username == username) \
        .first()


def get_users(
    db: Session, skip: int = 0, limit: int = 100
):
    return db.query(models.Users) \
        .offset(skip) \
        .limit(limit) \
        .all()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.Users(
        nickname=user.nickname,
        username=user.username,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int):
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Users not found")
    db.delete(user)
    db.commit()
    return user
