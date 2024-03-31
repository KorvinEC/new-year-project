from sqlalchemy import Column, Integer, JSON, ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship

from database.session import Base


class Users(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    nickname: Mapped[str]

    templates: Mapped[list["Templates"]] = relationship("Templates", back_populates="user",
                                                        cascade="all, delete-orphan")


class Templates(Base):
    __tablename__ = "templates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    structure: Mapped[dict[str, str]] = Column(JSON, nullable=False)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    user: Mapped[Users] = relationship("Users", back_populates="templates")

    cards: Mapped[list["Cards"]] = relationship("Cards", back_populates="template", cascade="all, delete-orphan")


class Cards(Base):
    __tablename__ = "cards"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    data: Mapped[list[dict[str, str]]] = Column(JSON, nullable=False)

    template_id: Mapped[int] = mapped_column(ForeignKey("templates.id"), nullable=False)
    template: Mapped[Templates] = relationship("Templates", back_populates="cards")

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
