const openings = [
  {
    name: 'Italian Game',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
  },
  {
    name: 'Ruy Lopez',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
  },
  {
    name: 'Sicilian Defense',
    moves: ['e4', 'c5'],
  },
  {
    name: 'French Defense',
    moves: ['e4', 'e6'],
  },
  {
    name: 'Caro-Kann Defense',
    moves: ['e4', 'c6'],
  },
  {
    name: "Queen's Gambit",
    moves: ['d4', 'd5', 'c4'],
  },
  {
    name: "King's Indian Defense",
    moves: ['d4', 'Nf6', 'c4', 'g6'],
  },
  {
    name: 'English Opening',
    moves: ['c4'],
  },
  {
    name: 'Reti Opening',
    moves: ['Nf3'],
  },
  {
    name: 'Van Geet Opening',
    moves: ['Nc3'],
  },
  {
    name: "King's Fianchetto Opening",
    moves: ['g3'],
  },
  {
    name: 'Nimzowitsch-Larsen Attack',
    moves: ['b3'],
  },
  {
    name: 'London System',
    moves: ['d4', 'd5', 'Bf4'],
  },
];

export function detectOpening(history: string[]) {
  const match = openings
    .filter((opening) =>
      opening.moves.every(
        (move, index) => history[index] === move,
      ),
    )
    .sort((a, b) => b.moves.length - a.moves.length)[0];

  return match?.name;
}
