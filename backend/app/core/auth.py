import typing

import jwt
from fastapi import Depends
from jwt import PyJWTError
from sqlalchemy.orm import Session

from database import schemas, session
from database.crud import get_user_by_username, create_user
from core import security
from core.exceptions import CredentialsException


async def get_current_user(
    db=Depends(session.get_db), token: str = Depends(security.oauth2_scheme)
):
    try:
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        username: str = payload.get("sub")

        if username is None:
            raise CredentialsException

        token_data = schemas.TokenData(username=username)

    except PyJWTError:
        raise CredentialsException

    user = get_user_by_username(db, token_data.username)

    if user is None:
        raise CredentialsException

    return user


def authenticate_user(
        db,
        username: str,
        password: str
) -> typing.Optional[schemas.User]:
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not security.verify_password(password, user.hashed_password):
        return None
    return user


def sign_up_new_user(db: Session, username: str, password: str, nickname: str):
    user = get_user_by_username(db, username)

    if user:
        return False

    new_user = create_user(
        db,
        schemas.UserCreate(
            username=username,
            password=password,
            nickname=nickname,
        ),
    )
    return new_user
