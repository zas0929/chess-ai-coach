# Roadmap — ♔ Chess AI Coach

## Vision

Chess AI Coach is an open-source chess training app that combines a modern chess UI, Stockfish analysis, and an AI coach that explains moves in human language.

The goal is not just to play chess, but to help the user train, analyze, and improve.

---

## Phase 1 — Chess Client Core

Goal: build a polished local chess client for playing against Stockfish.

### Already implemented

* Next.js frontend
* FastAPI backend
* Stockfish integration
* Play against engine
* Move history
* Evaluation display
* Evaluation bar
* Last move highlight
* Legal move highlight
* Captured pieces
* Material advantage
* Check / checkmate king highlight
* New Game
* Undo
* Thinking indicator
* Dark modern UI

### Remaining

* Flip board
* Choose side: White / Black / Random
* Engine plays first when user chooses Black
* Sound effects
* Better game end state UI
* Engine settings UI
* Responsive layout
* Light/dark theme toggle

---

## Phase 2 — Better Engine Integration

Goal: move from basic Stockfish responses to real engine analysis.

### Planned

* Replace `stockfish` wrapper with `python-chess` UCI engine
* Depth
* Nodes
* NPS
* Move time
* Threads
* Hash size
* MultiPV
* Principal variation
* Best move lines
* Configurable skill level
* Configurable search depth
* Configurable move time

---

## Phase 3 — Game Analysis

Goal: analyze finished games like Chess.com / Lichess.

### Planned

* PGN export
* PGN import
* FEN import/export
* Evaluation graph
* Move classification:

  * Best
  * Excellent
  * Good
  * Inaccuracy
  * Mistake
  * Blunder
* Accuracy score
* Critical moments timeline
* Best move suggestions
* Replay mode
* Jump to any move in history

---

## Phase 4 — AI Coach

Goal: add an AI assistant that explains chess decisions using engine-backed data.

### Planned

* Explain last move
* Explain engine move
* Suggest better moves
* Explain mistakes
* Explain plans
* Coach comments during game
* Post-game review
* Natural-language summaries
* “Why is this move good?” mode
* “What should I focus on?” mode

The AI Coach should not guess. It should receive structured context from:

* Current FEN
* Move history
* Stockfish evaluation
* Best lines
* Material state
* Tactical changes
* Opening information

---

## Phase 5 — Training Features

Goal: turn the app into a personal chess trainer.

### Planned

* Tactical puzzles from user mistakes
* Opening explorer
* Opening names
* Opening repertoire
* Endgame training
* Daily training tasks
* Coach-generated exercises
* Weakness tracking
* Personalized recommendations

---

## Phase 6 — Product Polish

Goal: make the app feel like a real product.

### Planned

* Full sidebar redesign
* Smooth animations
* Better board theme
* Piece theme selector
* Keyboard shortcuts
* Settings modal
* Persistent user preferences
* Local game database
* Better mobile layout
* App icon and branding
* README screenshots
* GitHub-ready documentation

---

## Phase 7 — Optional Online Features

Goal: add cloud and social features later.

### Possible future work

* User accounts
* Saved games
* Cloud analysis
* Shareable analysis links
* Import games from Chess.com
* Import games from Lichess
* Public game review pages
* Coach profiles
* Multiplayer analysis room

---

## Current Focus

Finish Phase 1:

1. Flip board
2. Choose player side
3. Engine settings
4. Sound effects
5. Game end UI
6. Sidebar polish
