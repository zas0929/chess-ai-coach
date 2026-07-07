from pydantic import BaseModel

class MoveRequest(BaseModel):
    fen: str


class MoveResponse(BaseModel):
    move: str
    evaluation: dict
