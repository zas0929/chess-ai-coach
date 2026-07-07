const sounds = {
  move: new Audio('/sounds/move.mp3'),
  capture: new Audio('/sounds/capture.mp3'),
  check: new Audio('/sounds/check.mp3'),
  checkmate: new Audio('/sounds/checkmate.mp3'),
  start: new Audio('/sounds/start.mp3'),
  undo: new Audio('/sounds/undo.mp3'),
};

export const SoundService = {
  play(name: keyof typeof sounds) {
    const sound = sounds[name];

    sound.currentTime = 0;

    sound.play().catch(() => {});
  },
};
