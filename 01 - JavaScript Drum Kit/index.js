class Dram {
  constructor(key, audio) {
    this.key = key;
    this.audio = audio;
    this.className = 'playing';

    key.addEventListener('transitionend', (event) => {
      if (event.propertyName !== 'transform') {
        return;
      }
      key.classList.remove(this.className);
    });
  }

  playSound() {
    this.audio.currentTime = 0;
    this.audio.play();
    this.key.classList.add(this.className);
  }
}

const keys = Array.from(document.querySelectorAll('.key'));
const dramMap = Array.from(document.querySelectorAll('audio')).reduce((drams, audio) => {
  const keyCode = audio.dataset.key;
  const pressedKey = keys.find(key => key.dataset.key === keyCode);
  if (!pressedKey) {
    return drams;
  }
  return Object.assign(drams, { [keyCode]: new Dram(pressedKey, audio) });
}, {});

addEventListener('keydown', (event) => {
  const dram = dramMap[event.keyCode.toString()];
  if (dram) {
    dram.playSound();
  }
});
