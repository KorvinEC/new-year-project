import uuid
from enum import Enum

from pydantic import BaseModel, Json, HttpUrl


class CardDataTypes(str, Enum):
    nominations = "nominations"
    suggestions = "suggestions"


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
        from_attributes = True


class CardData(BaseModel):
    id: int
    title: str | None = None
    subtitle: str | None = None
    description: str | None = None
    image_url: HttpUrl | None = None
    image_uuid: uuid.UUID | None = None


class CardCategories(BaseModel):
    nominations: list[CardData]
    suggestions: list[CardData]


class Card(BaseModel):
    id: int
    data: CardCategories


class CreateNominationData(BaseModel):
    description: str | None = None


class CreateSuggestionData(BaseModel):
    title: str | None = None
    subtitle: str | None = None
    description: str | None = None


class CreateCard(BaseModel):
    card_template_id: int
    card_nominations_data: list[CreateNominationData]
    card_suggestions_data: list[CreateSuggestionData]


class AddCardSuggestions(BaseModel):
    card_suggestions_data: list[CreateSuggestionData]
