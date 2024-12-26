from sqlalchemy.orm.session import Session
from database.models import Users
from sqlalchemy.exc import NoResultFound

from users.exceptions import UserNotFound


def get_user_by_id(
    user_id: int,
    db: Session,
) -> Users:
    try:
        return db.query(Users).filter(Users.id == user_id).one()
    except NoResultFound:
        raise UserNotFound(user_id)
