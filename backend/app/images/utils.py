from typing import TypeVar
from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy.exc import NoResultFound

from images.exceptions import ImageNotFound
from database.models import Images, UserImage

T = TypeVar("T", Images, UserImage)


def get_image_by_uuid(
    uuid: UUID,
    db: Session,
    image_class: T,
) -> T:
    try:
        return db.query(image_class).filter(image_class.id == uuid).one()
    except NoResultFound:
        raise ImageNotFound(uuid)
