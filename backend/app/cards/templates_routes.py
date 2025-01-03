import json
from typing import Annotated

from cards.exceptions import TemplateRemoveForbidden
from cards.schemas import CardTemplate, CardTemplateTitles
from cards.utils import get_card_template_by_id
from core.auth import get_current_user
from database.models import Templates
from database.schemas import User
from database.session import get_db
from fastapi import APIRouter, Depends, Query, status
from fastapi.responses import Response
from sqlalchemy.orm import Session

from pagination import PagedResponse, paginate

templates_router = APIRouter(prefix="/templates")
router = APIRouter(tags=["Templates"])
protected_router = APIRouter(
    dependencies=[Depends(get_current_user)], tags=["Protected templates"]
)


@router.get("/", response_model=PagedResponse[CardTemplate])
async def get_cards_templates(
    db: Annotated[Session, Depends(get_db)],
    page: Annotated[int, Query(ge=1)] = 1,
    per_page: Annotated[int, Query(ge=1)] = 50,
) -> PagedResponse[CardTemplate]:
    query = db.query(Templates).order_by(Templates.id.desc())
    return paginate(query, CardTemplate, page, per_page)


@protected_router.post("/", response_model=CardTemplate)
async def create_card_template(
    input_data: CardTemplateTitles,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> Templates:
    template = Templates(
        structure=json.dumps(input_data.model_dump().get("structure", [])),
        user_id=current_user.id,
    )

    db.add(template)
    db.commit()

    return template


@router.get("/{template_id}/", response_model=CardTemplate)
async def get_card_template(
    template_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> Templates:
    return get_card_template_by_id(template_id, db)


@protected_router.delete("/{template_id}/")
async def delete_template(
    template_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> Response:
    template = get_card_template_by_id(template_id, db)

    if template.user.id != current_user.id:
        raise TemplateRemoveForbidden

    db.delete(template)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


templates_router.include_router(router)
templates_router.include_router(protected_router)
