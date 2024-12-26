from typing import Type, TypeVar
from uuid import UUID

import sqlalchemy
from sqlalchemy.orm import Session

from cards.exceptions import (
    CardTemplateNotFound,
    CardNotFound,
    CardDataNotFound,
    CardDataTypeNotFound,
    ImageNotFound,
)
from cards.schemas import CardDataTypes
from database.models import Templates, Cards, Images, UserImage


def get_card_template_by_id(
    template_id: int,
    db: Session,
) -> Type[Templates]:
    try:
        return db.query(Templates).filter(Templates.id == template_id).one()
    except sqlalchemy.orm.exc.NoResultFound:
        raise CardTemplateNotFound(template_id)


def get_card_by_id(
    card_id: int,
    db: Session,
) -> Type[Cards]:
    try:
        return db.query(Cards).filter(Cards.id == card_id).one()
    except sqlalchemy.orm.exc.NoResultFound:
        raise CardNotFound(card_id)


def get_card_data_by_id(
    card_id: int,
    data_id: int,
    card_data_type: CardDataTypes,
    db: Session,
) -> (Type[Cards], dict):
    card = get_card_by_id(card_id, db)

    try:
        return card, [
            item for item in card.data[card_data_type.name] if item["id"] == data_id
        ][0]
    except KeyError:
        raise CardDataTypeNotFound(card_id, card_data_type)
    except IndexError:
        raise CardDataNotFound(card_id, data_id, card_data_type)


T = TypeVar("T", Images, UserImage)


def get_image_by_uuid(
    uuid: UUID,
    db: Session,
    image_class: T,
) -> T:
    try:
        return db.query(image_class).filter(image_class.id == uuid).one()
    except sqlalchemy.orm.exc.NoResultFound:
        raise ImageNotFound(uuid)
