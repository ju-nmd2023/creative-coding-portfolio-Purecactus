const palette = [
  "#e63946", // Red
  "#f1c40f", // Yellow
  "#2a9d8f", // Light blue/teal
  "#264653", // Dark blue
  "#1583c2", // Normal blue
  "#ef8354", // Orange
  "#6d4c41", // Brown
];

class Ball {
  constructor(x, y, r = 16) {
    this.position = createVector(x, y);
    const a = random(TWO_PI);
    const s = random(2, 5);
    this.velocity = createVector(cos(a) * s, sin(a) * s);
    this.r = r;
    this.column = color(random(palette));
  }

  update() {
    this.position.add(this.velocity);
    if (this.position.x - this.r < 0) {
      this.position.x = this.r;
      this.velocity.x *= -1;
    } else if (this.position.x + this.r > width) {
      this.position.x = width - this.r;
      this.velocity.x *= -1;
    }
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
    fill(this.column);
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

  // This updates the positions
  for (const b of balls) b.update();

  // This resolves the collisions between circle and circle
  resolveCollisions(balls);

  for (const b of balls) b.draw();
}

function mouseClicked() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  balls.push(new Ball(mouseX, mouseY, random(12, 24)));
}

//Collision detection
function resolveCollisions(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      const A = arr[i];
      const B = arr[j];
      let delta = p5.Vector.sub(B.position, A.position);
      let distance = delta.mag();
      const minDistance = A.r + B.r;

      if (distance === 0) {
        // Random direction when cirlce is spawned
        delta.set(random(-1, 1), random(-1, 1));
        distance = delta.mag();
      }

      if (distance < minDistance) {
        const n = delta.copy().div(distance);
        const overlap = minDistance - distance;

        const correct = n.copy().mult(overlap / 2);
        A.position.sub(correct);
        B.position.add(correct);

        const va = A.velocity.copy();
        const vb = B.velocity.copy();

        const vaN = p5.Vector.mult(n, va.dot(n));
        const vbN = p5.Vector.mult(n, vb.dot(n));
        const vaT = p5.Vector.sub(va, vaN);
        const vbT = p5.Vector.sub(vb, vbN);

        A.velocity = p5.Vector.add(vaT, vbN);
        B.velocity = p5.Vector.add(vbT, vaN);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}
