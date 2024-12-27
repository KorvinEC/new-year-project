import uuid
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends, UploadFile, status, Request, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified

from cards.exceptions import (
    CardDataLengthNotMatch,
    CardRemoveForbidden,
    CardDataRemoveForbidden,
)
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
)
from images.utils import get_image_by_uuid
from core.auth import get_current_user
from database.models import Cards, Images
from database.schemas import User
from database.session import get_db
from pagination import PagedResponse, paginate

cards_router = APIRouter(prefix="/api/cards")
router = APIRouter(tags=["Cards"])
protected_router = APIRouter(
    dependencies=[Depends(get_current_user)], tags=["Protected cards"]
)


@router.get("/", response_model=PagedResponse[Card])
async def get_cards(
    db: Annotated[Session, Depends(get_db)],
    page: Annotated[int, Query(ge=1)] = 1,
    per_page: Annotated[int, Query(ge=1)] = 50,
):
    query = db.query(Cards).order_by(Cards.id.desc())
    return paginate(query, Card, page, per_page)


@protected_router.post("/", response_model=Card)
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
) -> Card:
    card = get_card_by_id(card_id, db)

    return card


@protected_router.post(
    "/{card_id}", response_model=Card, description="Add suggestions to card"
)
async def add_suggestions_to_card(
    card_id: int,
    input_data: AddCardSuggestions,
    db: Annotated[Session, Depends(get_db)],
) -> Card:
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


@protected_router.delete("/{card_id}")
async def delete_card(
    card_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> Response:
    card = get_card_by_id(card_id, db)

    if card.user.id != current_user.id:
        raise CardRemoveForbidden

    db.delete(card)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@protected_router.delete("/{card_id}/data/{data_id}", response_model=Card)
async def delete_sub_card(
    card_id: int,
    data_id: int,
    card_data_type: Annotated[CardDataTypes, Query(...)],
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> Card:
    card, _ = get_card_data_by_id(card_id, data_id, card_data_type, db)

    if card.user.id != current_user.id:
        raise CardDataRemoveForbidden

    card.data[card_data_type.name] = [
        item for item in card.data[card_data_type.name] if item["id"] != data_id
    ]

    flag_modified(card, "data")
    db.commit()

    return card


@protected_router.post("/{card_id}/data/{data_id}/image")
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
    if card_data.get("image_uuid", None):
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
        f'/app/images/cards/{card.id}/{image_uuid}{Path(image_file.filename or "tempname").suffix}'
    )

    if not file_path.parent.exists():
        file_path.parent.mkdir(parents=True)

    image_url = (
        f"{request.url.scheme}://{request.url.netloc}/api/images/cards/{image_uuid}"
    )

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


cards_router.include_router(router)
cards_router.include_router(templates_router)
cards_router.include_router(protected_router)
