from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.engine import router as engine_router

app = FastAPI(title="Chess AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    engine_router,
    prefix="/engine",
    tags=["Engine"]
)


@app.get("/")
def root():
    return {
        "message": "Chess AI API is running"
    }
