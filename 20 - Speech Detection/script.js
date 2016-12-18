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

class Recognition {
  constructor(notifier) {
    this.notifier = notifier;
    this._text = '';
  }

  get text() {
    return this._text;
  }

  set text(transcript) {
    this._text = transcript;
    this.notifyUpdate();
  }

  addHandler(handler) {
    this.notifier.addHandler(handler);
  }

  notifyUpdate() {
    this.notifier.notify();
  }
}

class ViewModel {
  constructor(words) {
    this.words = words;
    this.currentParagraph = document.createElement('p');
    this.words.appendChild(this.currentParagraph);
    this.recognition = new Recognition(new Notifier());

    this.recognition.addHandler(() => {
      this.text = this.recognition.text;
    });
    this.recognition.notifyUpdate();
  }

  recognize(ev) {
    const transcript = Array.from(ev.results)
      .map(result => result[0].transcript)
      .join('');

    this.recognition.text = transcript;
    this.currentParagraph.textContent = this.text;

    if (!ev.results[0].isFinal) { return; }

    this.currentParagraph = document.createElement('p');
    this.words.appendChild(this.currentParagraph);
  }
}

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
const words = document.querySelector('.words');
const vm = new ViewModel(words);

recognition.addEventListener('result', ev => vm.recognize(ev));
recognition.addEventListener('end', recognition.start);
recognition.start();
