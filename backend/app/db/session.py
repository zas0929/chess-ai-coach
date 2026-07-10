from collections.abc import Generator
from typing import Optional

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings


engine = (
    create_engine(
        settings.database_url,
        pool_pre_ping=True,
        connect_args={
            "connect_timeout": 5,
        },
    )
    if settings.database_url
    else None
)

SessionLocal = (
    sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )
    if engine
    else None
)


def get_db() -> Generator[Optional[Session], None, None]:
    if not SessionLocal:
        yield None
        return

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
