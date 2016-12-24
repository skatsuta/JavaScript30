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

class Game {
  constructor() {
    this._score = 0;
    this.notifier = new Notifier();
  }

  get score() {
    return this._score;
  }

  set score(point) {
    this._score = point;
    this.notifyUpdate();
  }

  addHandler(handler) {
    this.notifier.addHandler(handler);
  }

  notifyUpdate() {
    this.notifier.notify();
  }
}

class GameViewModel {
  constructor(holes, scoreBoard) {
    this.holes = holes;
    this.scoreBoard = scoreBoard;
    this.game = new Game();
    this.score = 0;
    this.lastHole = null;
    this.timeUp = false;

    this.game.addHandler(() => {
      this.score = this.game.score;
    });
    this.game.notifyUpdate();
  }

  randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  randomHole() {
    const idx = Math.floor(Math.random() * this.holes.length);
    const hole = this.holes[idx];
    if (hole === this.lastHole) {
      return this.randomHole();
    }
    this.lastHole = hole;
    return hole;
  }

  peep() {
    const min = 200, max = 1000;
    const time = this.randomTime(min, max);
    const hole = this.randomHole();
    hole.classList.add('up');
    setTimeout(() => {
      hole.classList.remove('up');
      if (!this.timeUp) this.peep();
    }, time);
  }

  bonk(ev) {
    if (!ev.isTrusted) { return; }

    this.game.score++;
    this.scoreBoard.textContent = this.score;
  }

  startGame() {
    this.game.score = 0;
    this.scoreBoard.textContent = this.score;
    this.timeUp = false;
    this.peep();

    const timeLimit = 10000; // 10s
    setTimeout(() => this.timeUp = true, timeLimit);
  }
}



const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const vm = new GameViewModel(holes, scoreBoard);

moles.forEach(mole => mole.addEventListener('click', ev => vm.bonk(ev)));

const startButton = document.querySelector('button#start');
startButton.addEventListener('click', () => vm.startGame());
