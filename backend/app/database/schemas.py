from pydantic import BaseModel
import typing as t


class UserBase(BaseModel):
    username: str
    nickname: str


class UserOut(UserBase):
    pass


class UserCreate(UserBase):
    password: str

    class Config:
        from_attributes = True


class UserEdit(UserBase):
    password: t.Optional[str] = None

    class Config:
        from_attributes = True


class Image(BaseModel):
    id: int


class User(UserBase):
    id: int
    image: Image

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str = None
