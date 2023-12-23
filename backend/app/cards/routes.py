from pathlib import Path
from typing import Annotated, Type
import logging

from fastapi import APIRouter, Depends, UploadFile, status, Request
from fastapi.responses import FileResponse, Response
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified

from core.auth import get_current_user
from database.schemas import User
from database.models import Cards
from database.session import get_db
from cards.utils import get_card_template_by_id, get_card_by_id, get_card_data_by_id
from cards.templates_routes import templates_router
from cards.schemas import Card, CreateCard, CardTemplateCreation
from cards.exceptions import (
    CardDataLengthNotMatch,
    CardDataNotFound,
    CardDataImageNotFound,
    CardDataImageDoesNotExist,
)

cards_router = router = APIRouter()
router.include_router(templates_router, prefix="/templates", dependencies=[Depends(get_current_user)])

logger = logging.getLogger(__name__)


@router.get("/", response_model=list[Card])
async def get_cards(
        db: Annotated[Session, Depends(get_db)],
) -> list[Type[Cards]]:

    return db.query(Cards).all()


@router.post("/", response_model=Card)
async def create_card(
        input_data: CreateCard,
        db: Annotated[Session, Depends(get_db)],
        current_user: Annotated[User, Depends(get_current_user)],
) -> Card:

    card_template = get_card_template_by_id(input_data.card_template_id, db)
    card_template_schema = CardTemplateCreation.model_validate(card_template)

    if len(input_data.card_data) != len(card_template_schema.structure):
        raise CardDataLengthNotMatch

    card_data_to_database = []

    for index, (card_data, template_structure) in enumerate(
            zip(input_data.card_data, card_template_schema.structure),
            start=1
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

    return card_data_model


@router.get("/{card_id}", response_model=Card)
async def get_card(
        card_id: int,
        db: Annotated[Session, Depends(get_db)],
) -> Type[Card]:

    card = get_card_by_id(card_id, db)

    return card


@router.post("/{card_id}/images/{data_id}")
async def add_card(
        card_id: int,
        data_id: int,
        image_file: UploadFile,
        db: Annotated[Session, Depends(get_db)],
        request: Request,
) -> Response:

    card, card_data = get_card_data_by_id(card_id, data_id, db)

    # Check if this item has an image and delete it

    image_path: str | None = card_data.get("image", None)

    if image_path and (image_path_obj := Path(image_path)).exists():
        image_path_obj.unlink()

    file_path = Path(f'/app/images/{card.id}/{data_id}_{image_file.filename}')

    card_data["image_url"] = str(request.url)
    card_data["image_path"] = file_path.as_posix()

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

    return Response(status_code=status.HTTP_201_CREATED)


@router.get("/{card_id}/images/{data_id}")
async def get_card_image(
        card_id: int,
        data_id: int,
        db: Annotated[Session, Depends(get_db)],
) -> FileResponse:

    _, card_data = get_card_data_by_id(card_id, data_id, db)

    try:
        image_path = card_data.get("image_path", None)
    except IndexError:
        raise CardDataNotFound(card_id, data_id)

    if not image_path:
        raise CardDataImageNotFound(card_id, data_id)

    image_path_obj = Path(image_path)

    if not image_path_obj.exists():
        raise CardDataImageDoesNotExist(card_id, data_id)

    return FileResponse(image_path_obj)
