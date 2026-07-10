const soundFiles = {
  move: '/sounds/move.mp3',
  capture: '/sounds/capture.mp3',
  check: '/sounds/check.mp3',
  checkmate: '/sounds/check.mp3',
  start: '/sounds/start.mp3',
  undo: '/sounds/move.mp3',
};

type SoundName = keyof typeof soundFiles;

const sounds: Partial<Record<SoundName, HTMLAudioElement>> = {};

function getSound(name: SoundName) {
  if (typeof Audio === 'undefined') {
    return null;
  }

  sounds[name] ??= new Audio(soundFiles[name]);

  return sounds[name] ?? null;
}

export const SoundService = {
  play(name: SoundName) {
    const sound = getSound(name);

    if (!sound) {
      return;
    }

    sound.currentTime = 0;

    sound.play().catch(() => {});
  },
};
