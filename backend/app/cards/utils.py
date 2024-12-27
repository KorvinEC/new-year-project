from sqlalchemy.orm import Session
from sqlalchemy.exc import NoResultFound

from cards.exceptions import (
    CardTemplateNotFound,
    CardNotFound,
    CardDataNotFound,
    CardDataTypeNotFound,
)
from cards.schemas import CardDataTypes
from database.models import Templates, Cards


def get_card_template_by_id(
    template_id: int,
    db: Session,
) -> Templates:
    try:
        return db.query(Templates).filter(Templates.id == template_id).one()
    except NoResultFound:
        raise CardTemplateNotFound(template_id)


def get_card_by_id(
    card_id: int,
    db: Session,
) -> Cards:
    try:
        return db.query(Cards).filter(Cards.id == card_id).one()
    except NoResultFound:
        raise CardNotFound(card_id)


def get_card_data_by_id(
    card_id: int,
    data_id: int,
    card_data_type: CardDataTypes,
    db: Session,
) -> tuple[Cards, dict[str, str]]:
    card = get_card_by_id(card_id, db)

    try:
        return card, [
            item for item in card.data[card_data_type.name] if item["id"] == data_id
        ][0]
    except KeyError:
        raise CardDataTypeNotFound(card_id, card_data_type)
    except IndexError:
        raise CardDataNotFound(card_id, data_id, card_data_type)
