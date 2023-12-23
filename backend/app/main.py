from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
import uvicorn
import logging

from authentication.auth import auth_router
from core.auth import get_current_user
from cards.routes import cards_router
from users.routes import users_router
from core import config
from database.session import SessionLocal, create_tables


app = FastAPI(
    title=config.PROJECT_NAME,
    docs_url="/api/docs",
    openapi_url="/api"
)

origins = [
    "*"
]

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
        handlers=[
            logging.StreamHandler()
        ]
    )
    return logging.getLogger(__name__)


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    request.state.db = SessionLocal()
    response = await call_next(request)
    request.state.db.close()
    return response


@app.on_event("startup")
def on_startup():
    setup_logger()
    create_tables()


@app.get("/api")
async def root():
    return {"message": "Hello World"}

app.include_router(auth_router, prefix="/api/authentication", tags=["Authentication"])
app.include_router(cards_router, prefix="/api/cards", tags=["Cards"], dependencies=[Depends(get_current_user)])
app.include_router(users_router, prefix="/api/users", tags=["Users"], dependencies=[Depends(get_current_user)])


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8000)
