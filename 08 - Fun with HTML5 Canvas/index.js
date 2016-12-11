class Painter {
  constructor(ctx) {
    ctx.strokeStyle = '#BADA55';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    this.ctx = ctx;

    this.MIN_LINE_WIDTH = 1;
    this.MAX_LINE_WIDTH = 100;

    this.isDrawing = false;
    this.lastX = this.lastY = 0;
    this.hue = 0;
    this.direction = true;
  }

  draw(e) {
    if (!this.isDrawing) { return; }

    const ctx = this.ctx;
    ctx.strokeStyle = `hsl(${this.hue}, 100%, 50%)`;
    ctx.beginPath();
    ctx.moveTo(this.lastX, this.lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
    this.hue < 360 ? this.hue++ : this.hue = 0;

    if (ctx.lineWidth <= this.MIN_LINE_WIDTH || ctx.lineWidth >= this.MAX_LINE_WIDTH) {
      this.direction = !this.direction;
    }
    this.direction ? ctx.lineWidth++ : ctx.lineWidth--;
  }

  startDrawing(e) {
    this.isDrawing = true;
    [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
  }

  stopDrawing() {
    this.isDrawing = false;
  }
}

const canvas = document.querySelector('#draw');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const painter = new Painter(canvas.getContext('2d'));
[
  { eventType: 'mousemove', callback: e => painter.draw(e) },
  { eventType: 'mousedown', callback: e => painter.startDrawing(e) },
  { eventType: 'mouseup',   callback: () => painter.stopDrawing() },
  { eventType: 'mouseout',  callback: () => painter.stopDrawing() }
].forEach(({eventType, callback}) => canvas.addEventListener(eventType, callback));
