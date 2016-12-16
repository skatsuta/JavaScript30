class Notifier {
  constructor() {
    this.handlers = [];
  }

  observe(handler) {
    this.handlers.push(handler);
  }

  fire() {
    this.handlers.forEach(handler => handler());
  }
}

class Painting {
  constructor(lineWidth) {
    this.lineWidth = lineWidth;
    this.lastX = this.lastY = this.hue = 0;
    this.direction = true;
    this.notifier = new Notifier();
  }

  observe(handler) {
    this.notifier.observe(handler);
  }

  draw(e) {
    this.lastX = e.offsetX;
    this.lastY = e.offsetY;
    this.hue < 360 ? this.hue++ : this.hue = 0;

    const minLineWidth = 1;
    const maxLineWidth = 100;
    if (this.lineWidth < minLineWidth || this.lineWidth > maxLineWidth) {
      this.direction = !this.direction;
    }
    this.direction ? this.lineWidth++ : this.lineWidth--;

    this.notifier.fire();
  }

  startDrawing(e) {
    this.lastX = e.offsetX;
    this.lastY = e.offsetY;

    this.notifier.fire();
  }
}

class CtxViewModel {
  constructor(ctx) {
    this.painting = new Painting(ctx.lineWidth);

    this.isDrawing = false;
    this.lastX = this.painting.lastX;
    this.lastY = this.painting.lastY;
    this.hue = this.painting.hue;

    this.ctx = ctx;
    this.ctx.lineWidth = 1;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#BADA55';

    // register handler to observer
    this.painting.observe(() => {
      this.lastX = this.painting.lastX;
      this.lastY = this.painting.lastY;
      this.ctx.lineWidth = this.painting.lineWidth;
      this.ctx.strokeStyle = `hsl(${this.painting.hue}, 100%, 50%)`;
    });
  }

  draw(e) {
    if (!this.isDrawing) { return; }

    this.painting.draw(e);

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(e.offsetX, e.offsetY);
    this.ctx.stroke();
  }

  startDrawing(e) {
    this.isDrawing = true;
    this.painting.startDrawing(e);
  }

  stopDrawing() {
    this.isDrawing = false;
  }
}

const canvas = document.querySelector('#draw');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctxVm = new CtxViewModel(canvas.getContext('2d'));
[
  { eventType: 'mousemove', callback: e => ctxVm.draw(e) },
  { eventType: 'mousedown', callback: e => ctxVm.startDrawing(e) },
  { eventType: 'mouseup',   callback: () => ctxVm.stopDrawing() },
  { eventType: 'mouseout',  callback: () => ctxVm.stopDrawing() }
].forEach(({eventType, callback}) => canvas.addEventListener(eventType, callback));
