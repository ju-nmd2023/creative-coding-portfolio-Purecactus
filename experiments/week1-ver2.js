/* For this recreation, I have used the lecture example: 
https://codepen.io/pixelkind/pen/WNLraMw */

const size = 22;
const columns = 12;
const rows = 22;
const gap = 0;

const jitter = size * 0.8; // position chaos

function setup() {
  createCanvas(innerWidth, innerHeight);
  rectMode(CENTER);
  noLoop();
}

function draw() {
  background("#ffffff");
  noFill();
  stroke(0);
  strokeWeight(1);

  let y = (height - size * rows - gap * (rows - 1)) / 2 + size / 2;

  for (let i = 0; i < rows; i++) {
    let x = (width - size * columns - gap * (columns - 1)) / 2 + size / 2;

    const t = (i + 1) / rows;
    const s = size * (0.6 + 1.5 * t);

    for (let k = 0; k < columns; k++) {
      const dx = random(-jitter * t, jitter * t);
      const dy = random(-jitter * t, jitter * t);

      push();
      translate(x + dx, y + dy);
      ellipse(0, 0, s);
      pop();

      x += size + gap;
    }
    y += size + gap;
  }
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}
