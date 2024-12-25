import logging
import uuid
from pathlib import Path
from typing import Annotated, Type

from fastapi import APIRouter, Depends, UploadFile, status, Request, Query
from fastapi.responses import FileResponse, Response
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified

from cards.exceptions import CardDataLengthNotMatch, ImageNotFound
from cards.schemas import (
    Card,
    CreateCard,
    CardTemplateCreation,
    CardDataTypes,
    AddCardSuggestions,
)
from cards.templates_routes import templates_router
from cards.utils import (
    get_card_template_by_id,
    get_card_by_id,
    get_card_data_by_id,
    get_image_by_uuid,
)
from core.auth import get_current_user
from database.models import Cards, Images
from database.schemas import User
from database.session import get_db

cards_router = router = APIRouter()
router.include_router(
    templates_router, prefix="/templates", dependencies=[Depends(get_current_user)]
)

images_router = APIRouter()

logger = logging.getLogger(__name__)


@router.get("/", response_model=list[Card])
async def get_cards(
    db: Annotated[Session, Depends(get_db)],
) -> list[Type[Cards]]:
    return db.query(Cards).order_by(Cards.id.desc()).all()


@router.post("/", response_model=Card)
async def create_card(
    input_data: CreateCard,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> Card:
    card_template = get_card_template_by_id(input_data.card_template_id, db)
    card_template_schema = CardTemplateCreation.model_validate(card_template)

    if len(input_data.card_nominations_data) != len(card_template_schema.structure):
        raise CardDataLengthNotMatch

    card_nominations_to_database = []
    card_suggestions_to_database = []

    for index, (card_data, template_structure) in enumerate(
        zip(input_data.card_nominations_data, card_template_schema.structure),
    ):
        card_nominations_to_database.append(
            {"id": index, **card_data.dict(), **template_structure}
        )

    for index, card_data in enumerate(input_data.card_suggestions_data):
        card_suggestions_to_database.append(
            {
                "id": index,
                **card_data.model_dump(),
            }
        )

    card_data_model = Cards(
        data={
            "nominations": card_nominations_to_database,
            "suggestions": card_suggestions_to_database,
        },
        user_id=current_user.id,
        template_id=card_template.id,
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


@router.post("/{card_id}", response_model=Card, description="Add suggestions to card")
async def add_suggestions_to_card(
    card_id: int,
    input_data: AddCardSuggestions,
    db: Annotated[Session, Depends(get_db)],
) -> Type[Card]:
    card = get_card_by_id(card_id, db)

    card_new_id = max([item["id"] for item in card.data["suggestions"]]) + 1

    card.data["suggestions"].extend(
        [
            {
                "id": index,
                **card_data.model_dump(),
            }
            for index, card_data in enumerate(
                input_data.card_suggestions_data, start=card_new_id
            )
        ]
    )

    flag_modified(card, "data")
    db.commit()
    return card


@router.delete("/{card_id}")
async def delete_card(
    card_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> Response:
    card = get_card_by_id(card_id, db)

    db.delete(card)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete("/{card_id}/data/{data_id}", response_model=Card)
async def delete_sub_card(
    card_id: int,
    data_id: int,
    card_data_type: Annotated[CardDataTypes, Query(...)],
    db: Annotated[Session, Depends(get_db)],
) -> Type[Card]:
    card, _ = get_card_data_by_id(card_id, data_id, card_data_type, db)

    logger.debug(f"{card.data = }")

    card.data[card_data_type.name] = [
        item for item in card.data[card_data_type.name] if item["id"] != data_id
    ]

    flag_modified(card, "data")
    db.commit()

    return card


@router.post("/{card_id}/data/{data_id}/image")
async def add_image_to_card(
    card_id: int,
    data_id: int,
    card_data_type: Annotated[CardDataTypes, Query(...)],
    image_file: UploadFile,
    db: Annotated[Session, Depends(get_db)],
    request: Request,
) -> Response:
    card, card_data = get_card_data_by_id(card_id, data_id, card_data_type, db)

    # Clear previous image if exists
    if card_data.get("image_uuid"):
        image_data = get_image_by_uuid(card_data["image_uuid"], db)
        image_path_obj = Path(image_data.path)

        if image_path_obj.exists():
            image_path_obj.unlink()

        card_data["image_uuid"] = None
        card_data["image_url"] = None

        flag_modified(card, "data")
        db.delete(image_data)
        db.commit()

    # Create and update image data

    image_uuid = uuid.uuid4()
    file_path = Path(
        f'/app/images/{card.id}/{image_uuid}.{image_file.filename.split(".")[-1]}'
    )

    if not file_path.parent.exists():
        file_path.parent.mkdir(parents=True)

    image_url = f"{request.url.scheme}://{request.url.netloc}/api/images/{image_uuid}"

    card_data["image_uuid"] = str(image_uuid)
    card_data["image_url"] = image_url

    # Save image

    try:
        with open(file_path, "wb") as buffer:
            buffer.write(image_file.file.read())
    finally:
        image_file.file.close()

    # Create image object

    image_model = Images(
        id=image_uuid, path=file_path.as_posix(), url=image_url, card_id=card.id
    )

    db.add(image_model)
    flag_modified(card, "data")
    db.commit()

    return Response(status_code=status.HTTP_201_CREATED)


@images_router.get("/{image_uuid}")
async def get_card_image(
    image_uuid: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
) -> FileResponse:
    image_data = get_image_by_uuid(image_uuid, db)
    image_path_obj = Path(image_data.path)

    if not image_path_obj.exists():
        raise ImageNotFound(image_uuid)

    return FileResponse(image_path_obj)
