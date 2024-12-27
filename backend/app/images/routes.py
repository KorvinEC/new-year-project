import uuid
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from images.exceptions import ImageNotFound
from images.utils import get_image_by_uuid
from database.models import Images, UserImage
from database.session import get_db


images_router = APIRouter()


@images_router.get("/cards/{image_uuid}")
async def get_card_image(
    image_uuid: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
) -> FileResponse:
    image_data = get_image_by_uuid(image_uuid, db, Images)
    image_path_obj = Path(image_data.path)

    if not image_path_obj.exists():
        raise ImageNotFound(image_uuid)

    return FileResponse(image_path_obj)


@images_router.get("/users/{image_uuid}")
async def get_user_image(
    image_uuid: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
) -> FileResponse:
    image_data = get_image_by_uuid(image_uuid, db, UserImage)
    image_path_obj = Path(image_data.path)

    if not image_path_obj.exists():
        raise ImageNotFound(image_uuid)

    return FileResponse(image_path_obj)
