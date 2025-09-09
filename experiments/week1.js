/* For this recreation, I have used the lecture example: 
https://codepen.io/pixelkind/pen/WNLraMw */

const size = 22;
const columns = 12;
const rows = 22;
const gap = 0;

// max rotation at the very bottom row
const chaos = 60;

// position chaos
const jitter = size * 0.15;

function setup() {
  createCanvas(innerWidth, innerHeight);

  // This sets the rotations to degrees instead of radians
  angleMode(DEGREES);

  // This makes it so that we draw squares from their center point
  rectMode(CENTER);

  noLoop();
}

function draw() {
  background("#ffffff");
  noFill();
  stroke(0);
  strokeWeight(1);

  // This makes it so that wedraw at the center position
  let y = (height - size * rows - gap * (rows - 1)) / 2 + size / 2;

  for (let i = 0; i < rows; i++) {
    let x = (width - size * columns - gap * (columns - 1)) / 2 + size / 2;

    /* This counts and determines the row number so that we can assign more and more chaos
    t goes from 0 to 1, 0 being the top row and 1 being the bottom row */
    const t = (i + 1) / rows;

    // Now we loop through all of the squares in each row
    for (let k = 0; k < columns; k++) {
      // Here we assign more and more jitter the further down we go
      const dx = random(-jitter * t, jitter * t);
      const dy = random(-jitter * t, jitter * t);

      // Here we assign more and more rotation the further down we go
      const angle = random(-chaos * t, chaos * t);

      push();

      /* This translte thing makes it so that the origin of drawing is moved to
      the squares "jittered" position */
      translate(x + dx, y + dy);
      rotate(angle);
      square(0, 0, size);
      pop();

      x += size + gap;
    }
    y += size + gap;
  }
}
