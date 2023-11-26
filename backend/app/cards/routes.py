from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends, UploadFile
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session

from core.auth import get_current_user
from database.schemas import User
from database.session import get_db
from cards.templates_routes import templates_router

cards_router = router = APIRouter()
router.include_router(templates_router, prefix="/templates", dependencies=[Depends(get_current_user)])


class CardData(BaseModel):
    id: int
    title: str
    subtitle: str | None = None
    description: str | None = None
    image: bool = False


class Card(BaseModel):
    id: int
    data: list[CardData]


@router.get("/")
async def get_cards(
        db: Annotated[Session, Depends(get_db)],
) -> list[Card]:

    test_data = [
        {
            "id": 1,
            "data": [
                {
                    "id": 1,
                    "title": "test_title_1",
                    "subtitle": "test_sub_title",
                    "description": "test_description_1"
                },
                {
                    "id": 2,
                    "title": "test_title_2",
                    "description": "test_description_2"
                },
                {
                    "id": 3,
                    "title": "test_title_3",
                    "description": "test_description_3"
                }
            ]
        },
        {
            "id": 2,
            "data": [
                {
                    "id": 1,
                    "title": "test_title_4",
                    "description": "test_description_4"
                },
                {
                    "id": 2,
                    "title": "test_title_5",
                    "description": "test_description_5"
                }
            ]
        },
        {
            "id": 3,
            "data": [
                {
                    "id": 1,
                    "title": "test_title_",
                    "description": "test_description_7"
                },
                {
                    "id": 2,
                    "title": "test_title_7",
                    "description": "test_description_7"
                },
                {
                    "id": 3,
                    "title": "test_title_8",
                    "description": "test_description_8"
                },
                {
                    "id": 4,
                    "title": "test_title_9",
                    "description": "test_description_9"
                }
            ]
        }
    ]

    return [Card(**test) for test in test_data]


class CreateCardData(BaseModel):
    description: str | None = None


class CreateCard(BaseModel):
    card_template_id: int
    card_data: list[CreateCardData]


@router.post("/")
async def create_card(
        input_data: CreateCard,
        db: Annotated[Session, Depends(get_db)],
        current_user: Annotated[User, Depends(get_current_user)],
) -> Card:

    test = {
        "id": 1,
        "data": [
            {
                "id": 1,
                "title": "test_title_1",
                "subtitle": "test_subtitle_1",
                "description": "test_description_1",
                "image": False
            },
            {
                "id": 2,
                "title": "test_title_2",
                "subtitle": None,
                "description": "test_description_2",
                "image": True
            },
            {
                "id": 3,
                "title": "test_title_3",
                "subtitle": None,
                "description": None,
                "image": False
            }
        ]
    }

    return Card(**test)


@router.get("/{card_id}")
async def get_card(
        card_id: int,
        db: Annotated[Session, Depends(get_db)],
) -> Card:

    test_data = {
        "id": card_id,
        "data": [
            {
                "id": 1,
                "title": "test_title_1",
                "subtitle": "test_sub_title",
                "description": "test_description_1",
                "image": True
            },
            {
                "id": 2,
                "title": "test_title_2",
                "description": "test_description_2"
            },
            {
                "id": 3,
                "title": "test_title_3",
                "description": "test_description_3"
            }
        ]
    }

    return Card(**test_data)


@router.post("/{card_id}/images")
async def add_card(
        card_id: int,
        image_file: UploadFile,
        db: Annotated[Session, Depends(get_db)],
) -> Response:

    return Response(status_code=200)


@router.get("/{card_id}/images/{image_id}")
async def get_card_image(
        card_id: int,
        image_id: int,
        db: Annotated[Session, Depends(get_db)],
) -> FileResponse:

    file_path = Path('/app/images/Test.svg')

    return FileResponse(file_path)
