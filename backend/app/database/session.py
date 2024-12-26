from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

engine = create_engine(
    "postgresql://postgres:postgres@postgres:5432/postgres",
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# declarative base class
class Base(DeclarativeBase): ...


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    Base.metadata.create_all(bind=engine)
