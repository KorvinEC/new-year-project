import json
from typing import Annotated, Type
import logging

import sqlalchemy
from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from core.auth import get_current_user
from database.schemas import User
from database.session import get_db
from database.models import Templates
from cards.schemas import CardTemplate, CardTemplateTitles


logger = logging.getLogger(__name__)


templates_router = router = APIRouter()


@router.get("/", response_model=list[CardTemplate])
async def get_structures(
        db: Annotated[Session, Depends(get_db)],
) -> list[Type[Templates]]:

    templates = db.query(Templates).all()

    logger.debug(f"{templates = }")

    return templates


@router.post("/", response_model=CardTemplate)
async def create_structures(
        input_data: CardTemplateTitles,
        db: Annotated[Session, Depends(get_db)],
        current_user: Annotated[User, Depends(get_current_user)],
) -> CardTemplate:

    logger.debug(f"{input_data = }")

    template = Templates(
        structure=json.dumps(input_data.dict().get("structure", [])),
        user_id=current_user.id
    )

    db.add(template)
    db.commit()

    logger.debug(f"{template = }")

    return template


@router.get("/{template_id}", response_model=CardTemplate | None)
async def get_structure(
        template_id: int,
        db: Annotated[Session, Depends(get_db)],
) -> Type[Templates] | None:

    try:
        template = db.query(Templates).filter(Templates.id == template_id).one()
    except sqlalchemy.orm.exc.NoResultFound:
        return None
    except sqlalchemy.orm.exc.MultipleResultsFound:
        raise Exception("Multiple templates found")

    return template
