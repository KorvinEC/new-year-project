from uuid import UUID

from fastapi import HTTPException, status


class ImageNotFound(HTTPException):
    def __init__(self, uuid: UUID):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Image with id {uuid} not found",
        )
