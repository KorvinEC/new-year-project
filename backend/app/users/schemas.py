from pydantic import BaseModel
from sqlalchemy.util.typing import final
import uuid


class UserImage(BaseModel):
    id: uuid.UUID
    url: str

    @final
    class Config:
        from_attributes = True


class User(BaseModel):
    nickname: str
    id: int
    image: UserImage | None

    @final
    class Config:
        from_attributes = True
