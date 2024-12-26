import uuid

from sqlalchemy import JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy.sql import text

from database.session import Base


class Users(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    nickname: Mapped[str] = mapped_column()

    templates: Mapped[list["Templates"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    cards: Mapped[list["Cards"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    image: Mapped["UserImage"] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


class Templates(Base):
    __tablename__ = "templates"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    structure: Mapped[dict[str, str]] = mapped_column(JSON, nullable=False)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    user: Mapped[Users] = relationship(back_populates="templates")

    cards: Mapped[list["Cards"]] = relationship(
        back_populates="template", cascade="all, delete-orphan"
    )


class Cards(Base):
    __tablename__ = "cards"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    data: Mapped[list[dict[str, str]]] = mapped_column(JSON, nullable=False)

    template_id: Mapped[int] = mapped_column(ForeignKey("templates.id"), nullable=False)
    template: Mapped[Templates] = relationship(back_populates="cards")

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    user: Mapped[Users] = relationship(back_populates="cards")

    images: Mapped[list["Images"]] = relationship(
        back_populates="card", cascade="all, delete-orphan"
    )


class Images(Base):
    __tablename__ = "images"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("(gen_random_uuid())")
    )
    path: Mapped[str] = mapped_column(nullable=False)
    url: Mapped[str] = mapped_column(nullable=False)

    card_id: Mapped[int] = mapped_column(ForeignKey("cards.id"), nullable=False)
    card: Mapped[Cards] = relationship(back_populates="images")


class UserImage(Base):
    __tablename__ = "user_image"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("(gen_random_uuid())")
    )
    path: Mapped[str] = mapped_column(nullable=False)
    url: Mapped[str] = mapped_column(nullable=False)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    user: Mapped[Users] = relationship(back_populates="image", single_parent=True)
