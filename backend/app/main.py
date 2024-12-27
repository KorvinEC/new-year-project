from collections.abc import Awaitable, Callable
from contextlib import asynccontextmanager
import logging

import uvicorn
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request

from authentication.auth import auth_router
from cards.routes import cards_router
from images.routes import images_router
from core import config
from database.session import SessionLocal, create_tables
from users.routes import users_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    _ = setup_logger()
    create_tables()
    yield


app = FastAPI(
    title=config.PROJECT_NAME,
    docs_url="/api/docs",
    openapi_url="/api",
    lifespan=lifespan,
)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def setup_logger():
    logging.basicConfig(
        level=logging.DEBUG,
        format="%(levelname)-10s%(name)s - %(message)s",
        handlers=[logging.StreamHandler()],
    )
    return logging.getLogger(__name__)


@app.middleware("http")
async def db_session_middleware(
    request: Request, call_next: Callable[[Request], Awaitable[Response]]
):
    request.state.db = SessionLocal()
    response = await call_next(request)
    request.state.db.close()
    return response


app.include_router(auth_router)
app.include_router(cards_router)
app.include_router(users_router)
app.include_router(images_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8000)
