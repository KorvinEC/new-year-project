from pydantic import BaseModel


class User(BaseModel):
    nickname: str
    id: int

    class Config:
        from_attributes = True
