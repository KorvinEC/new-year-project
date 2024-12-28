from pathlib import Path
from typing import Annotated
import uuid

from fastapi.requests import Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status, Form
from datetime import timedelta
from sqlalchemy.orm import Session

from database.models import UserImage
from database.session import get_db
from core import security
from core.auth import authenticate_user, sign_up_new_user


auth_router = router = APIRouter(prefix="/api/authentication", tags=["Authentication"])


@router.post("/token")
async def login(
    db: Annotated[Session, Depends(get_db)],
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
):
    user = authenticate_user(db, form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires,
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/signup")
async def signup(
    nickname: Annotated[str, Form()],
    username: Annotated[str, Form()],
    password: Annotated[str, Form()],
    db: Annotated[Session, Depends(get_db)],
    image_file: Annotated[UploadFile, File()],
    request: Request,
):
    user = sign_up_new_user(db, username, password, nickname, image_file)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Account already exists",
            headers={"WWW-Authenticate": "Bearer"},
        )

    image_uuid = uuid.uuid4()
    image_file_suffix = Path(image_file.filename or "tempname").suffix
    file_path = Path(f"/app/images/users/{user.id}/{image_uuid}{image_file_suffix}")

    if not file_path.parent.exists():
        file_path.parent.mkdir(parents=True)

    image_url = (
        f"{request.url.scheme}://{request.url.netloc}/api/images/users/{image_uuid}"
    )

    # Save image

    try:
        with open(file_path, "wb") as buffer:
            _ = buffer.write(image_file.file.read())
    finally:
        image_file.file.close()

    # Create image object

    image_model = UserImage(
        id=image_uuid, path=file_path.as_posix(), url=image_url, user_id=user.id
    )

    user.image = image_model
    db.add(image_model)
    db.commit()

    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires,
    )

    return {"access_token": access_token, "token_type": "bearer", "user": user}
