from typing import Type

import sqlalchemy
from sqlalchemy.orm import Session

from database.models import Templates, Cards
from cards.exceptions import CardTemplateNotFound, CardNotFound


def get_card_template_by_id(
        template_id: int,
        db: Session,
) -> Type[Templates]:
    try:
        return db.query(Templates).filter(Templates.id == template_id).one()
    except sqlalchemy.orm.exc.NoResultFound:
        raise CardTemplateNotFound(template_id)


def update_card_images(
        card: Cards | Type[Cards],
) -> Cards | Type[Cards]:
    for item in card.data:
        item["image"] = isinstance(item["image"], str)

    return card


def get_card_by_id(
        card_id: int,
        db: Session,
) -> Type[Cards]:
    try:
        return db.query(Cards).filter(Cards.id == card_id).one()
    except sqlalchemy.orm.exc.NoResultFound:
        raise CardNotFound(card_id)
