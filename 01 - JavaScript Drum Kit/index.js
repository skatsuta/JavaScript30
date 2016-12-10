class Dram {
  constructor(key, audio) {
    this.key = key;
    this.audio = audio;
    this.className = 'playing';

    key.addEventListener('transitionend', event => {
      if (event.propertyName !== 'transform') { return; }
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
const drams = Array.from(document.querySelectorAll('audio'))
  .reduce((drams, audio) => {
    const keyCode = audio.dataset.key;
    const key = keys.find(key => key.dataset.key === keyCode);
    if (!key) { return; }
    drams[keyCode] = new Dram(key, audio);
    return drams;
  }, {});

window.addEventListener('keydown', event => {
  const dram = drams[event.keyCode.toString()];
  if (!dram) { return; }
  dram.playSound();
});
