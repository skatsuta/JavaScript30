'use strict';

class Notifier {
  constructor() {
    this.handlers = [];
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }

  notify() {
    this.handlers.forEach(handler => handler());
  }
}

class Player {
  constructor(notifier, volume = 1, playbackRate = 1) {
    this.notifier = notifier;
    this.paused = true;
    this._currentTime = 0;
    this._volume = volume;
    this._playbackRate = playbackRate;
  }

  get currentTime() {
    return this._currentTime;
  }

  set currentTime(time) {
    this._currentTime = time;
    this.notifyUpdate();
  }

  get volume() {
    return this._volume;
  }

  set volume(vol) {
    this._volume = vol;
    this.notifyUpdate();
  }

  get playbackRate() {
    return this._playbackRate;
  }

  set playbackRate(rate) {
    this._playbackRate = rate;
    this.notifyUpdate();
  }

  addHandler(handler) {
    this.notifier.addHandler(handler);
  }

  notifyUpdate() {
    this.notifier.notify();
  }

  togglePlay() {
    this.paused = !this.paused;
    this.notifyUpdate();
  }
}

class PlayerViewModel {
  constructor(video, toggle, progressBar) {
    this.video = video;
    this.toggle = toggle;
    this.progressBar = progressBar;
    this.mousedown = false;
    this.player = new Player(new Notifier());

    this.player.addHandler(() => {
      this.paused = this.player.paused;
      this.currentTime = this.player.currentTime;
      this.volume = this.player.volume;
      this.playbackRate = this.player.playbackRate;
    });
    this.player.notifyUpdate();
  }

  togglePlay() {
    this.player.togglePlay();

    const method = this.paused ? 'pause' : 'play';
    this.video[method]();
  }

  updateButton() {
    this.player.notifyUpdate();

    const icon = this.paused ? '►' : '❚ ❚';
    this.toggle.textContent = icon;
  }

  skip(target) {
    const sec = parseFloat(target.dataset.skip);
    this.player.currentTime += sec;

    this.video.currentTime = this.currentTime;
  }

  updateRange(target) {
    const name = target.name;
    const value = target.value;

    this.player[name] = value;
    this.video[name] = this[name];
  }

  progress() {
    const percent = this.currentTime / this.video.duration * 100;
    this.progressBar.style.flexBasis = `${percent}%`;
  }

  jump(ev) {
    const scrubTime = ev.offsetX / this.video.offsetWidth * this.video.duration;
    this.player.currentTime = scrubTime;

    this.video.currentTime = this.currentTime;
  }

  scrub(ev) {
    if (!this.mousedown) { return; }
    this.jump(ev);
  }
}


const player = document.querySelector('.player');
const video = player.querySelector('video.viewer');
const toggle = player.querySelector('button.toggle');
const progressBar = player.querySelector('.progress__filled');
const vm = new PlayerViewModel(video, toggle, progressBar);

// register event handlers

video.addEventListener('click', () => vm.togglePlay());
video.addEventListener('timeupdate', () => vm.progress());
['play', 'pause'].forEach(eventType => video.addEventListener(eventType, () => vm.updateButton()));

toggle.addEventListener('click', () => vm.togglePlay());

const progress = player.querySelector('.progress');
progress.addEventListener('click', ev => vm.jump(ev));
progress.addEventListener('mousemove', ev => vm.scrub(ev));
progress.addEventListener('mousedown', () => vm.mousedown = true);
progress.addEventListener('mouseup', () => vm.mousedown = false);

const skipButtons = player.querySelectorAll('[data-skip]');
skipButtons.forEach(button => button.addEventListener('click', ev => vm.skip(ev.target)));

const ranges = player.querySelectorAll('input[type="range"].player__slider');
['change', 'mousemove'].forEach(eventType =>
  ranges.forEach(range => range.addEventListener(eventType, ev => vm.updateRange(ev.target)))
);
