import logging
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.models import Users
from database.session import get_db
from core.auth import get_current_user
from users.schemas import User

users_router = router = APIRouter()

logger = logging.getLogger(__name__)


@router.get("/", response_model=list[User], response_model_exclude_none=True)
async def get_users(
        db: Annotated[Session, Depends(get_db)],
):
    return db.query(Users).all()


@router.get("/me", response_model=User, response_model_exclude_none=True)
async def user_me(current_user=Depends(get_current_user)):
    return current_user
