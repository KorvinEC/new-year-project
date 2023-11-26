from typing import Annotated

from fastapi import Depends, APIRouter
from pydantic import BaseModel
from sqlalchemy.orm import Session

from core.auth import get_current_user
from database.schemas import User
from database.session import get_db


templates_router = router = APIRouter()


class CardTemplateStruct(BaseModel):
    title: str
    subtitle: str | None


class CardTemplateTitles(BaseModel):
    structure: list[CardTemplateStruct]


class CardTemplate(BaseModel):
    id: int
    structure: list[CardTemplateStruct]


@router.get("/")
async def get_structures(
        db: Annotated[Session, Depends(get_db)],
) -> list[CardTemplate]:

    test_data = [
        {"id": 1, "structure": [
            {"title": "test_title_1", "subtitle": "test_subtitle_1"},
            {"title": "test_title_2", "subtitle": None},
            {"title": "test_title_3", "subtitle": "test_subtitle_3"}
        ]},
        {"id": 2, "structure": [
            {"title": "test_title_1", "subtitle": "test_subtitle_1"},
            {"title": "test_title_2", "subtitle": "test_subtitle_2"},
        ]},
        {"id": 3, "structure": [
            {"title": "test_title_1", "subtitle": "test_subtitle_1"},
            {"title": "test_title_2", "subtitle": "test_subtitle_2"},
            {"title": "test_title_3", "subtitle": "test_subtitle_3"},
            {"title": "test_title_4", "subtitle": None}
        ]},
    ]

    return [CardTemplate(**test) for test in test_data]


@router.post("/")
async def create_structures(
        input_data: CardTemplateTitles,
        db: Annotated[Session, Depends(get_db)],
        current_user: Annotated[User, Depends(get_current_user)],
) -> CardTemplate:

    test = {
        "id": 1,
        "structure": input_data.structure
    }

    return CardTemplate(**test)


@router.get("/{template_id}")
async def get_structure(
        template_id: int,
        db: Annotated[Session, Depends(get_db)],
) -> CardTemplate:

    test = {
        "id": 1,
        "structure": [
            {"title": "test_title_1", "subtitle": "test_subtitle_1"},
            {"title": "test_title_2", "subtitle": "test_subtitle_2"},
            {"title": "test_title_3", "subtitle": "test_subtitle_3"}
        ]
    }

    return CardTemplate(**test)
