const palette = [
  "#9400d3", // Purple
  "#4b0082", // Darker purple
  "#0000ff", // Blue
  "#00ff00", // Green
  "#ffff00", // Yellow
  "#ff7f00", // Orange
  "#ff0000", // Red
];

// Notes from the C Mayor scale
const c_mayor = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];

// Tone.js setup
let synth = null;
let audioReady = false;
const activeCollision = new Set(); // Playing sound only on collision

// Class for cirlces bouncing around the canvas, represents one moving circle
class Ball {
  constructor(x, y, r = 16) {
    this.position = createVector(x, y); // Circle center
    const angle = random(TWO_PI); // Random angle picker
    const speed = random(2, 5); // Random speed for ball
    this.velocity = createVector(cos(angle) * speed, sin(angle) * speed);
    this.r = r;
    this.color = color(random(palette));

    this.paletteIndex = floor(random(palette.length));
    this.colorHex = palette[this.paletteIndex];
    this.note = c_mayor[this.paletteIndex % c_mayor.length];
  }

  /* Function that moces tha ball around the canvas
   I used this thread as help: https://stackoverflow.com/questions/71803762/bouncing-an-object-off-a-wall?*/
  update() {
    // Left and right walls
    this.position.add(this.velocity);
    if (this.position.x - this.r < 0) {
      this.position.x = this.r;
      this.velocity.x *= -1;
    } else if (this.position.x + this.r > width) {
      this.position.x = width - this.r;
      this.velocity.x *= -1;
    }

    // Top and bottom walls
    if (this.position.y - this.r < 0) {
      this.position.y = this.r;
      this.velocity.y *= -1;
    } else if (this.position.y + this.r > height) {
      this.position.y = height - this.r;
      this.velocity.y *= -1;
    }
  }

  draw() {
    noStroke();
    fill(this.color);
    circle(this.position.x, this.position.y, this.r * 2);
  }
}

let balls = [];

function setup() {
  createCanvas(innerWidth, innerHeight);
  background("#f8f5ee");
}

function draw() {
  background("#f8f5ee");

  // This updates the positions (basically moves each ball and checks for collision)
  for (const b of balls) b.update();

  // This checks the collisions between circle and circle
  resolveCollisions(balls);

  for (const b of balls) b.draw();
}

// This adds a ball if the mouse button is clicked
function mouseClicked() {
  // Audio only starts after impact
  if (!audioReady) {
    synth = new Tone.PolySynth(Tone.Synth).toDestination();
    Tone.start().then(() => {
      audioReady = true;
    });
  }
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  balls.push(new Ball(mouseX, mouseY, random(12, 50)));
}

/* Collision detection (Compares each and every ball to one another)
This function is inspired from this video: https://www.youtube.com/watch?v=y14SpHKL1gg
Along with my collision detection from the p5.js game from previous course with Garrit */
function resolveCollisions(arr) {
  const overlappedThisFrame = new Set();

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      const A = arr[i];
      const B = arr[j];

      /* `${i}-${j}` is a template string.
      If i = 2 and j = 5, the result is the string "2-5".
      So pairKey is just a string identifier for: “ball 2 colliding with ball 5” */
      const pairKey = "${i}-${j}";

      let offset = p5.Vector.sub(B.position, A.position);
      let distance = offset.mag();
      const minDistance = A.r + B.r;

      // Checking if circles are overlapping
      // Random direction when cirlces overlap as to not cause errors
      if (distance === 0) {
        offset.set(random(-1, 1), random(-1, 1));
        distance = offset.mag();
      }

      // Pushing circles apart when they overlap
      if (distance < minDistance) {
        overlappedThisFrame.add(pairKey);

        const n = offset.copy().div(distance);
        const overlap = minDistance - distance;

        // This pushes the circles apart
        const correct = n.copy().mult(overlap / 2);
        A.position.sub(correct);
        B.position.add(correct);

        // This saves their velocity
        const velocityA = A.velocity.copy();
        const velocityB = B.velocity.copy();

        // Rest of the code makes the bounce elastic
        const velocityANormal = p5.Vector.mult(n, velocityA.dot(n));
        const velocityBNormal = p5.Vector.mult(n, velocityB.dot(n));
        const velocityATangent = p5.Vector.sub(velocityA, velocityANormal);
        const velocityBTangent = p5.Vector.sub(velocityB, velocityBNormal);

        A.velocity = p5.Vector.add(velocityATangent, velocityBNormal);
        B.velocity = p5.Vector.add(velocityBTangent, velocityANormal);

        // This plays a note when a collision happens
        if (!activeCollision.has(pairKey) && audioReady && synth) {
          synth.triggerAttackRelease(A.note, "8n");
          synth.triggerAttackRelease(B.note, "8n");
          activeCollision.add(pairKey);
        }
      }
    }
  }

  // This clears all of the pairs that have already interacted so that they can interact again
  for (const key of activeCollision) {
    if (!overlappedThisFrame.has(key)) activeCollision.delete(key);
  }
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}
