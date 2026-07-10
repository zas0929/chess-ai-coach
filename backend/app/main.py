from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.engine import router as engine_router
from app.api.coach import router as coach_router
from app.api.billing import router as billing_router
from app.core.config import settings
from app.db.base import Base
from app.db import models  # noqa: F401
from app.db.session import engine

app = FastAPI(title="Chess AI API")


@app.on_event("startup")
def startup():
    if engine:
        Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
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


@app.get("/")
def root():
    return {
        "message": "Chess AI API is running"
    }
