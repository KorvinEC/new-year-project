from fastapi import status
from fastapi.exceptions import HTTPException


class UserNotFound(HTTPException):
    def __init__(self, card_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {card_id} not found"
        )
