from pydantic import BaseModel
from sqlalchemy.util.typing import final

from users.schemas import User


class RegisterType(BaseModel):
    access_token: str
    token_type: str
    user: User

    @final
    class Config:
        from_attributes = True
