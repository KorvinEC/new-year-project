from pathlib import Path
from typing import Annotated, Type
import logging

from fastapi import APIRouter, Depends, UploadFile
from fastapi.responses import FileResponse, Response
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified

from core.auth import get_current_user
from database.schemas import User
from database.models import Cards, Templates
from database.session import get_db
from cards.templates_routes import templates_router
from cards.schemas import Card, CreateCard, CardTemplateCreation

cards_router = router = APIRouter()
router.include_router(templates_router, prefix="/templates", dependencies=[Depends(get_current_user)])

logger = logging.getLogger(__name__)


@router.get("/", response_model=list[Card])
async def get_cards(
        db: Annotated[Session, Depends(get_db)],
) -> list[Type[Cards]]:

    cards = db.query(Cards).all()

    for card in cards:
        for item in card.data:
            item["image"] = isinstance(item["image"], str)

    return cards


@router.post("/", response_model=Card)
async def create_card(
        input_data: CreateCard,
        db: Annotated[Session, Depends(get_db)],
        current_user: Annotated[User, Depends(get_current_user)],
) -> Card:

    # TODO add exceptions

    card_template = db\
        .query(Templates)\
        .filter(Templates.id == input_data.card_template_id)\
        .one()
    card_template_schema = CardTemplateCreation.model_validate(card_template)

    if len(input_data.card_data) != len(card_template_schema.structure):
        raise Exception("Card data length does not match template structure length")

    card_data_to_database = []

    for index, (card_data, template_structure) in enumerate(
            zip(input_data.card_data, card_template_schema.structure), start=1
    ):
        card_data_to_database.append({
            "id": index,
            "image": None,
            **card_data.dict(),
            **template_structure
        })

    card_data_model = Cards(
        data=card_data_to_database,
        user_id=current_user.id,
        template_id=card_template.id
    )
    db.add(card_data_model)
    db.commit()

    for item in card_data_model.data:
        item["image"] = isinstance(item["image"], str)

    return card_data_model


@router.get("/{card_id}", response_model=Card)
async def get_card(
        card_id: int,
        db: Annotated[Session, Depends(get_db)],
) -> Type[Card]:

    card = db.query(Cards).filter(Cards.id == card_id).one()

    for item in card.data:
        item["image"] = isinstance(item["image"], str)

    return card


@router.post("/{card_id}/images/{image_id}")
async def add_card(
        card_id: int,
        image_id: int,
        image_file: UploadFile,
        db: Annotated[Session, Depends(get_db)],
) -> Response:

    card = db.query(Cards).filter(Cards.id == card_id).one()

    # Check if this item exists

    try:
        card_data = [item for item in card.data if item["id"] == image_id][0]
    except IndexError:
        return Response(status_code=400, content="Card does not exist")

    # Check if this item has an image and delete it

    image_path: str | None = card_data.get("image", None)

    if image_path and (image_path_obj := Path(image_path)).exists():
        image_path_obj.unlink()

    file_path = Path(f'/app/images/{card.id}/{image_id}/{image_file.filename}')

    card_data["image"] = file_path.as_posix()

    # Create directory if it does not exist

    if not file_path.parent.exists():
        file_path.parent.mkdir(parents=True)

    # Save image

    try:
        with open(file_path, "wb") as buffer:
            buffer.write(image_file.file.read())
    finally:
        image_file.file.close()

    # Save changes to database

    flag_modified(card, "data")
    db.commit()

    return Response(status_code=200)


@router.get("/{card_id}/images/{image_id}")
async def get_card_image(
        card_id: int,
        image_id: int,
        db: Annotated[Session, Depends(get_db)],
) -> FileResponse:

    card = db.query(Cards).filter(Cards.id == card_id).one()

    image_path = card.data[image_id].get("image", None)

    image_path_obj = Path(image_path)

    if not image_path_obj.exists():
        raise Exception("Image does not exist")

    return FileResponse(image_path_obj)
