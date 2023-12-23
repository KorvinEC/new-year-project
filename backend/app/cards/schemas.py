from typing import Optional
from pydantic import BaseModel, Json


# Card templates schemas

class CardTemplateStruct(BaseModel):
    title: str
    subtitle: str | None

    class Config:
        from_attributes = True


class CardTemplateTitles(BaseModel):
    structure: list[CardTemplateStruct]


class User(BaseModel):
    id: int
    nickname: str

    class Config:
        from_attributes = True


class CardTemplate(BaseModel):
    id: int
    structure: Json
    user: User

    class Config:
        from_attributes = True


# Cards schemas


class CardTemplateCreation(BaseModel):
    id: int
    structure: Json

    class Config:
        from_attributes=True


class CardData(BaseModel):
    id: int
    title: str
    subtitle: str | None = None
    description: str | None = None
    image_url: Optional[str] = None


class Card(BaseModel):
    id: int
    data: list[CardData]


class CreateCardData(BaseModel):
    description: str | None = None


class CreateCard(BaseModel):
    card_template_id: int
    card_data: list[CreateCardData]
