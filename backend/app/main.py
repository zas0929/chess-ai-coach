import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError

from app.api.engine import router as engine_router
from app.api.coach import router as coach_router
from app.api.billing import router as billing_router
from app.api.games import router as games_router
from app.core.config import settings
from app.db.base import Base
from app.db import models  # noqa: F401
from app.db.session import engine

logger = logging.getLogger(__name__)

app = FastAPI(title="Chess AI API")


@app.on_event("startup")
def startup():
    if engine:
        try:
            Base.metadata.create_all(bind=engine)
        except SQLAlchemyError:
            logger.exception(
                "Database initialization failed. "
                "The API will keep running, but DB-backed features "
                "such as quota and billing may fail until DATABASE_URL "
                "is reachable."
            )

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    engine_router,
    prefix="/engine",
    tags=["Engine"]
)

app.include_router(
    coach_router,
    prefix="/coach",
    tags=["coach"],
)

app.include_router(
    billing_router,
    prefix="/billing",
    tags=["billing"],
)

app.include_router(
    games_router,
    prefix="/games",
    tags=["games"],
)


@app.get("/")
def root():
    return {
        "message": "Chess AI API is running"
    }
