from typing import Type

import sqlalchemy
from sqlalchemy.orm import Session

from database.models import Templates, Cards
from cards.exceptions import CardTemplateNotFound, CardNotFound, CardDataNotFound


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
        db: Session,
) -> (Type[Cards], dict):

    card = get_card_by_id(card_id, db)

    try:
        return card, [item for item in card.data if item["id"] == data_id][0]
    except IndexError:
        raise CardDataNotFound(card_id, data_id)
