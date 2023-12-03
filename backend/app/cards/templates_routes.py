import json
from typing import Annotated, Type
import logging

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from core.auth import get_current_user
from database.schemas import User
from database.session import get_db
from database.models import Templates
from cards.schemas import CardTemplate, CardTemplateTitles
from cards.utils import get_card_template_by_id


logger = logging.getLogger(__name__)


templates_router = router = APIRouter()


@router.get("/", response_model=list[CardTemplate])
async def get_cards_templates(
        db: Annotated[Session, Depends(get_db)],
) -> list[Type[Templates]]:

    templates = db.query(Templates).all()

    logger.debug(f"{templates = }")

    return templates


@router.post("/", response_model=CardTemplate)
async def create_card_template(
        input_data: CardTemplateTitles,
        db: Annotated[Session, Depends(get_db)],
        current_user: Annotated[User, Depends(get_current_user)],
) -> CardTemplate:

    template = Templates(
        structure=json.dumps(input_data.model_dump().get("structure", [])),
        user_id=current_user.id
    )

    db.add(template)
    db.commit()

    logger.debug(f"{template = }")

    return template


@router.get("/{template_id}", response_model=CardTemplate)
async def get_card_template(
        template_id: int,
        db: Annotated[Session, Depends(get_db)],
) -> Type[Templates]:
    return get_card_template_by_id(template_id, db)
