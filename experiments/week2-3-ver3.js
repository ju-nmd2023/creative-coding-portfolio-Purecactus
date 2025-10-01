const palette = [
  "#e63946", // Red
  "#f1c40f", // Yellow
  "#2a9d8f", // Light blue/teal
  "#264653", // Dark blue
  "#1583c2", // Normal blue
  "#ef8354", // Orange
  "#6d4c41", // Brown
];

// Class for cirlces bouncing around the canvas, represents one moving circle
class Ball {
  constructor(x, y, r = 16) {
    this.position = createVector(x, y); // Circle center
    const angle = random(TWO_PI); // Random angle picker
    const speed = random(2, 5); // Random speed for ball
    this.velocity = createVector(cos(angle) * speed, sin(angle) * speed);
    this.r = r;
    this.color = color(random(palette));
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
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  balls.push(new Ball(mouseX, mouseY, random(12, 24)));
}

/* Collision detection (Compares each and every ball to one another)
This function is inspired from this video: https://www.youtube.com/watch?v=y14SpHKL1gg
Along with my collision detection from the p5.js game from previous course with Garrit */
function resolveCollisions(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      const A = arr[i];
      const B = arr[j];
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
      }
    }
  }
}

//
function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}
