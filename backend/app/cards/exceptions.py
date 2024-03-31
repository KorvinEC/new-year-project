from uuid import UUID

from fastapi import HTTPException, status

from cards.schemas import CardDataTypes


class CardTemplateNotFound(HTTPException):
    def __init__(self, template_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Card template with id {template_id} not found"
        )


class CardDataLengthNotMatch(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Card data length does not match template structure length"
        )


class CardNotFound(HTTPException):
    def __init__(self, card_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Card with id {card_id} not found"
        )


class CardDataTypeNotFound(HTTPException):
    def __init__(self, card_id: int, card_data_type: CardDataTypes):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Card with id {card_id} doesn't have {card_data_type.name}"
        )


class CardDataNotFound(HTTPException):
    def __init__(self, card_id: int, data_id: int, card_data_type: CardDataTypes):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Card with id {card_id} and data with id {data_id} not found in {card_data_type.name}"
        )


class CardDataImageNotFound(HTTPException):
    def __init__(self, card_id: int, data_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Card with id {card_id} and data with id {data_id} does not have an image"
        )


class CardDataImageDoesNotExist(HTTPException):
    def __init__(self, card_id: int, data_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Image for card with id {card_id} and data with id {data_id} does not exist"
        )


class ImageNotFound(HTTPException):
    def __init__(self, uuid: UUID):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Image with id {uuid} not found"
        )
