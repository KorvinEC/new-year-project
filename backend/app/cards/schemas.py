from pydantic import BaseModel, Json


class CardTemplateStruct(BaseModel):
    title: str
    subtitle: str | None

    class Config:
        orm_mode = True


class CardTemplateTitles(BaseModel):
    structure: list[CardTemplateStruct]


class User(BaseModel):
    id: int
    nickname: str

    class Config:
        orm_mode = True


class CardTemplate(BaseModel):
    id: int
    structure: Json
    user: User

    class Config:
        orm_mode = True

