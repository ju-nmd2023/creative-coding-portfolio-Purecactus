/* For this recreation, I have used the lecture example: 
https://codepen.io/pixelkind/pen/WNLraMw */

const size = 22;
const columns = 12;
const rows = 22;
const gap = 0;

const chaos = 60; // max rotation at the very bottom row
const jitter = size * 0.15; // position chaos

function setup() {
  createCanvas(innerWidth, innerHeight);
  angleMode(DEGREES);
  rectMode(CENTER);
  noLoop();
}

function draw() {
  background("#ffffff");
  noFill();
  stroke(0);
  strokeWeight(1);

  // Starting to draw at the center position
  let y = (height - size * rows - gap * (rows - 1)) / 2 + size / 2;

  for (let i = 0; i < rows; i++) {
    let x = (width - size * columns - gap * (columns - 1)) / 2 + size / 2;

    const t = (i + 1) / rows;

    for (let k = 0; k < columns; k++) {
      const dx = random(-jitter * t, jitter * t);
      const dy = random(-jitter * t, jitter * t);
      const angle = random(-chaos * t, chaos * t);

      push();
      translate(x + dx, y + dy);
      rotate(angle);
      square(0, 0, size);
      pop();

      x += size + gap;
    }
    y += size + gap;
  }
}
