from pathlib import Path
from typing import Annotated
import uuid

from fastapi import APIRouter, Depends, Request, UploadFile, status
from fastapi.responses import Response
from sqlalchemy.orm import Session

from database.models import UserImage, Users
from database.session import get_db
from core.auth import get_current_user
from users.schemas import User
from users.utils import get_user_by_id

users_router = APIRouter(prefix="/api/users")
router = APIRouter(tags=["Users"])
protected_router = APIRouter(
    dependencies=[Depends(get_current_user)], tags=["Protected users"]
)


@router.get("/", response_model=list[User], response_model_exclude_none=True)
async def get_users(
    db: Annotated[Session, Depends(get_db)],
):
    return db.query(Users).all()


@protected_router.get("/me", response_model=User, response_model_exclude_none=True)
async def user_me(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    return current_user


@router.get("/{user_id}/", response_model=User, response_model_exclude_none=True)
async def get_user(
    user_id: int,
    db: Annotated[Session, Depends(get_db)],
):
    return get_user_by_id(user_id, db)


@protected_router.post("/{user_id}/image")
async def add_image_to_user(
    user_id: int,
    image_file: UploadFile,
    db: Annotated[Session, Depends(get_db)],
    request: Request,
) -> Response:
    user = get_user_by_id(user_id, db)

    # Create and update image data

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

    return Response(status_code=status.HTTP_201_CREATED)


users_router.include_router(router)
users_router.include_router(protected_router)
