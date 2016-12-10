const units = [
  {
    elem: document.querySelector('.second-hand'),
    method: 'getSeconds',
    max: 60
  },
  {
    elem: document.querySelector('.min-hand'),
    method: 'getMinutes',
    max: 60
  },
  {
    elem: document.querySelector('.hour-hand'),
    method: 'getHours',
    max: 12
  }
];

setInterval(setDate, 1000);

function setDate() {
  units.forEach(unit => {
    const now = new Date();
    const deg = (now[unit.method]() / unit.max) * 360 + 90;
    unit.elem.style.transform = `rotate(${deg}deg)`;
  });
}
