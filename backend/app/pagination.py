import math
from typing import Generic, TypeVar, final

from pydantic import BaseModel
from sqlalchemy.orm.query import Query

from database.models import Cards, Templates, Users


T = TypeVar("T", bound=BaseModel)


class PagedResponse(BaseModel, Generic[T]):
    total_items: int
    total_pages: int
    page: int
    per_page: int
    items: list[T]

    @final
    class Config:
        from_attributes = True


M = TypeVar("M", Templates, Cards, Users)


def paginate(
    query: Query[M], model: type[T], page: int, per_page: int
) -> PagedResponse[T]:
    query_count = query.count()
    paginated_query = query.offset((page - 1) * per_page).limit(per_page).all()
    return PagedResponse(
        total_items=query_count,
        total_pages=math.ceil(query_count / per_page),
        page=page,
        per_page=per_page,
        items=[model.model_validate(page_item) for page_item in paginated_query],
    )
