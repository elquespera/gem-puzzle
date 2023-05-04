import moveUrl from '../assets/audio/move.mp3';
import winUrl from '../assets/audio/win.mp3';

const SOUNDS = {
  move: {
    src: moveUrl,
  },
  win: {
    src: winUrl,
  },
};

function playAudio(link, isAudio = true) {
  if (!isAudio) return;
  const src = link.src || link;
  const audio = new Audio(src);
  audio.play();
}

export { playAudio, SOUNDS };
