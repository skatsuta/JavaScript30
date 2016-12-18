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

class Model {
  constructor(notifier) {
    this.notifier = notifier;
    this.snapshots = [];
  }

  addHandler(handler) {
    this.notifier.addHandler(handler);
  }

  notifyUpdate() {
    this.notifier.notify();
  }

  addSnapshot(snapshot) {
    this.snapshots.push(snapshot);
    this.notifyUpdate();
  }
}

class ViewModel {
  constructor(video, ctx, snap, strip) {
    this.video = video;
    this.ctx = ctx;
    this.snap = snap;
    this.strip = strip;
    this.model = new Model(new Notifier());

    // get webcam video
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(localMediaStream => {
        this.video.src = URL.createObjectURL(localMediaStream);
        this.video.play();
      })
      .catch(err => console.error(err));
  }

  paintToCanvas() {
    // paint to canvas
    const { videoWidth: width, videoHeight: height } = this.video;
    canvas.width = width;
    canvas.height = height;

    const delay = 16;
    return setInterval(() => this.ctx.drawImage(this.video, 0, 0, width, height), delay);
  }

  takePhoto() {
    // sound snapshot
    this.snap.currentTime = 0;
    this.snap.play();

    const data = canvas.toDataURL('image/jpeg');
    this.model.addSnapshot(data);

    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'snapshot');
    link.innerHTML = `<img src="${data}" alt="snapshot">`;
    this.strip.insertBefore(link, this.strip.firstChild);
  }
}


const canvas = document.querySelector('canvas.photo');
const ctx = canvas.getContext('2d');
const video = document.querySelector('video.player');
const snap = document.querySelector('audio.snap');
const strip = document.querySelector('.strip');
const vm = new ViewModel(video, ctx, snap, strip);

video.addEventListener('canplay', () => vm.paintToCanvas());

const takePhotoButton = document.querySelector('button#take_photo');
takePhotoButton.addEventListener('click', () => vm.takePhoto());
