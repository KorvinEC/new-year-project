from typing import Annotated

from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import timedelta
from sqlalchemy.orm import Session

from database.session import get_db
from core import security
from core.auth import authenticate_user, sign_up_new_user

auth_router = router = APIRouter()


@router.post("/token")
async def login(
        db: Annotated[Session, Depends(get_db)],
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    user = authenticate_user(db, form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(
        minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    access_token = security.create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires,
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/signup")
async def signup(
        db: Annotated[Session, Depends(get_db)],
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    user = sign_up_new_user(db, form_data.username, form_data.password, form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Account already exists",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(
        minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    access_token = security.create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires,
    )

    return {"access_token": access_token, "token_type": "bearer"}
