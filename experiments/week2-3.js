/* This is my recreation of a flow field that was originally made by Tyler Hobbs on his webpage: https://www.tylerxhobbs.com/words/flow-fields
It will probably be easier to do since he has what seems to be python code, or some other code language on his website that shows how to construct
the flow field, but the hard part will be to accurately translate it to p5.js */

// Variables
const fieldSize = 50;
const maxColumns = Math.ceil(innerWidth / fieldSize);
const maxRows = Math.ceil(innerHeight / fieldSize);
const divider = 8;
const diagonalAngle = radians(-22);
const bias = 0.75;

// Colors
const BG = "#f8f5ee"; // Tan background
const palette = [
  "#e63946", // Red
  "#f1c40f", // Yellow
  "#2a9d8f", // Light blue
  "#264653", // Dark blue
  "#1583c2", // Normal blue
  "#ef8354", // Orange
  "#6d4c41", // Brown
];

class Agent {
  constructor(x, y, maxSpeed, maxForce, col, w) {
    this.position = createVector(x, y);
    this.lastPosition = createVector(x, y);
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;

    this.col = col;
    this.w = w;
  }

  follow(desiredDirection) {
    desiredDirection = desiredDirection.copy();
    desiredDirection.mult(this.maxSpeed);
    let steer = p5.Vector.sub(desiredDirection, this.velocity);
    steer.limit(this.maxForce);
    this.applyForce(steer);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.lastPosition = this.position.copy();
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  checkBorders() {
    if (this.position.x < 0) {
      this.position.x = innerWidth;
      this.lastPosition.x = innerWidth;
    } else if (this.position.x > innerWidth) {
      this.position.x = 0;
      this.lastPosition.x = 0;
    }
    if (this.position.y < 0) {
      this.position.y = innerHeight;
      this.lastPosition.y = innerHeight;
    } else if (this.position.y > innerHeight) {
      this.position.y = 0;
      this.lastPosition.y = 0;
    }
  }

  draw() {
    stroke(this.col);
    strokeWeight(this.w);
    line(
      this.lastPosition.x,
      this.lastPosition.y,
      this.position.x,
      this.position.y
    );
  }
}

let field;
let agents = [];

function setup() {
  createCanvas(innerWidth, innerHeight);
  pixelDensity(2);
  background(BG);
  noiseDetail(4, 0.5);
  noiseSeed(Math.random() * 1e9);

  field = generateField();
  generateAgents();
}

function generateField() {
  const f = [];
  for (let x = 0; x < maxColumns; x++) {
    f.push([]);
    for (let y = 0; y < maxRows; y++) {
      const n = noise(x / divider, y / divider) * TWO_PI; // your original idea
      const noiseDir = p5.Vector.fromAngle(n);
      const diagDir = p5.Vector.fromAngle(diagonalAngle);
      const dir = p5.Vector.lerp(diagDir, noiseDir, 1.0 - bias).normalize();
      f[x].push(dir);
    }
  }
  return f;
}

function generateAgents() {
  agents = [];

  const count = 240;
  for (let i = 0; i < count; i++) {
    const t = random();
    const base = p5.Vector.lerp(
      // Adding the 20000 instead of 0 kind of started drawing everything off screen
      createVector(20000, 0),
      createVector(innerWidth, innerHeight),
      t
    );
    const perp = p5.Vector.fromAngle(diagonalAngle + HALF_PI).mult(
      (random() - 0.5) * min(width, height) * 0.6
    );
    const p = p5.Vector.add(base, perp);

    let w;
    if (random() < 0.08) w = random(4, 15);
    else if (random() < 0.6) w = random(0.7, 2.2);
    else w = random(3, 9);

    const col = random() < 0.2 ? color(BG) : color(random(palette));

    agents.push(new Agent(p.x, p.y, 4, 0.12, col, w));
  }
}

function radians(deg) {
  return (deg * Math.PI) / 180;
}

function draw() {
  for (let k = 0; k < 2; k++) {
    for (let agent of agents) {
      const gx = constrain(
        floor(agent.position.x / fieldSize),
        0,
        maxColumns - 1
      );
      const gy = constrain(floor(agent.position.y / fieldSize), 0, maxRows - 1);
      const desiredDirection = field[gx][gy];
      agent.follow(desiredDirection);
      agent.update();
      agent.checkBorders();
      agent.draw();
    }
  }
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}
