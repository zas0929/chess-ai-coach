# Architecture — ♔ Chess AI Coach

## Overview

Chess AI Coach is a local-first chess training application.

The current architecture consists of:

* Frontend: Next.js + React + TypeScript
* Chess UI: react-chessboard
* Game rules: chess.js
* Backend: FastAPI
* Engine: Stockfish
* Future AI layer: LLM-based coach

---

## High-Level Flow

```text
User move
  ↓
Frontend validates move with chess.js
  ↓
Frontend sends FEN to FastAPI
  ↓
FastAPI asks Stockfish for best move
  ↓
Stockfish returns move + evaluation
  ↓
Frontend applies engine move
  ↓
UI updates board, history, evaluation, material, and status
```

---

## Frontend

### Main responsibilities

* Render chessboard
* Handle user moves
* Validate moves with chess.js
* Maintain local game state
* Call backend engine API
* Display:

  * board position
  * move history
  * evaluation
  * captured pieces
  * material advantage
  * legal moves
  * check/checkmate status
  * engine status

### Main folders

```text
src/
  app/
    page.tsx
    layout.tsx

  components/
    Chess/
      ChessBoard.tsx
      ChessControls.tsx
      EvaluationBar.tsx
      MoveHistory.tsx
      ThinkingIndicator.tsx
      CapturedPieces/

  hooks/
    useChessGame.ts

  services/
    engine.service.ts
    sound.service.ts
    toast.service.ts

  types/
    engine.ts

  utils/
    chess/
      material.ts
```

---

## `useChessGame`

`useChessGame` is the current main game controller.

It owns:

* Chess instance
* FEN
* Move history
* Evaluation
* Thinking state
* Last move
* Selected square
* Legal moves
* Captured pieces / material state
* Check and checkmate state

Current returned API:

```ts
{
  fen,
  moves,
  evaluation,
  thinking,
  onDrop,
  newGame,
  undo,
  lastMove,
  selectPiece,
  possibleMoves,
  selectedSquare,
  engineStats,
  material,
  checkedKingSquare,
  isCheckmate,
}
```

As the project grows, this hook may later be split into smaller hooks:

* `useBoardState`
* `useEngine`
* `useMoveHistory`
* `useMaterial`
* `useGameStatus`

This should only happen when the hook becomes difficult to maintain.

---

## Backend

### Current responsibilities

* Expose engine API
* Load Stockfish
* Receive FEN
* Return best move
* Return evaluation
* Return basic engine stats

### Current structure

```text
backend/
  app/
    main.py
    api/
      engine.py
    core/
      config.py
    models/
      engine.py
    services/
      stockfish_service.py
```

---

## Engine API

### `POST /engine/move`

Request:

```json
{
  "fen": "..."
}
```

Response:

```json
{
  "move": "e7e5",
  "evaluation": {
    "type": "cp",
    "value": 32
  },
  "stats": {
    "time": 0.42,
    "skill_level": 10
  }
}
```

---

## Engine Layer

### Current implementation

The backend currently uses the Python `stockfish` wrapper.

This is simple and good for MVP, but limited.

### Planned implementation

Move to `python-chess` UCI engine integration.

This will allow:

* Depth
* Nodes
* NPS
* MultiPV
* Principal variation
* Configurable analysis limits
* Stronger game review
* Better AI Coach context

---

## Material Calculation

Material is calculated from the current board state instead of manually tracking captures.

Benefits:

* Undo works automatically
* New game works automatically
* Future FEN import works automatically
* Future PGN replay works automatically

Material logic lives in:

```text
src/utils/chess/material.ts
```

---

## AI Coach Architecture

The AI Coach should be introduced as a separate layer.

It should not directly guess chess quality from raw moves.

Instead, it should receive structured context:

```text
Position
Move history
Stockfish evaluation
Best lines
Material balance
Move classification
Opening data
Game phase
```

Then it can generate explanations such as:

* why a move is good
* why a move is bad
* what plan exists in the position
* what the user should improve
* what tactical idea was missed

---

## Future AI Flow

```text
Frontend position
  ↓
Backend analysis request
  ↓
Stockfish MultiPV
  ↓
Analysis context builder
  ↓
LLM Coach
  ↓
Human-readable explanation
  ↓
Frontend Coach panel
```

---

## Design Principles

* Keep chess logic deterministic
* Use Stockfish for objective evaluation
* Use LLM only for explanation and coaching
* Do not let LLM invent engine analysis
* Keep UI calm, focused, and minimal
* Avoid bright colors
* Prefer dark theme with soft accents
* Make every feature useful for training

---

## Product Direction

Chess AI Coach should become:

1. A chess client
2. An analysis board
3. A game review tool
4. A personal AI chess coach
5. A learning platform

The project should remain modular so each layer can evolve independently.
