from sqlalchemy import Column, Integer, JSON
from sqlalchemy.orm import mapped_column, Mapped

from database.session import Base


class Users(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    nickname: Mapped[str]


class Templates(Base):
    __tablename__ = "templates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    structure: Mapped[dict[str, str]] = Column(JSON, nullable=False)

    user_id: Mapped[int] = mapped_column(Integer, nullable=False)


class Cards(Base):
    __tablename__ = "cards"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    data: Mapped[dict[str, dict[str, str]]] = Column(JSON, nullable=False)

    template_id: Mapped[int] = mapped_column(Integer, nullable=False)
