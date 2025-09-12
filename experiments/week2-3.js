/* This is my recreation of a flow field that was originally made by Tyler Hobbs on his webpage: https://www.tylerxhobbs.com/words/flow-fields
It will probably be easier to do since he has what seems to be python code, or some other code language on his website that shows how to construct
the flow field, but the hard part will be to accurately translate it to p5.js */

const fieldSize = 50;
const divider = 4;
const agentNum = 10;
const noiseScale = 1 / 300;
const maxSpeed = 2;
const maxForce = 0.05;
const margin = 100;

let cols;
let rows;
let agents = [];
let zOff = 0;
let field;

let frameCounter = 0;
const maxFrames = 4000;

const palette = [
  "#e63946",
  "#f1c40f",
  "#2a9d8f",
  "#264653",
  "#8d99ae",
  "#6d4c41",
];

function easeInOut(t) {
  return sin(t * PI);
}

class Agent {
  constructor(x, y, maxSpeed, maxForce) {
    this.position = createVector(x, y);
    this.lastPosition = this.position.copy();
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;

    // Adding a more handdrawn feel to the flow field
    this.c = color(random(palette));
    this.maxW = random(60, 36); // Ribbon style
    this.life = 0;
    this.maxLife = int(random(300, 600)); // Ribbon lengths
  }
  reset() {
    this.position.set(
      random(margin, width - margin),
      random(margin, height - margin)
    );
    this.lastPosition.set(this.position);
    this.velocity.set(0, 0);
    this.acceleration.set(0, 0);
    this.c = color(random(palette));
    this.maxW = random(10, 36);
    this.life = 0;
    this.maxLife = int(random(400, 800));
  }
  follow(desiredDirection) {
    const desired = desiredDirection.copy().mult(this.maxSpeed);
    const steer = p5.Vector.sub(desired, this.velocity).limit(this.maxForce);
    this.applyForce(steer);
  }
  applyForce(force) {
    this.acceleration.add(force);
  }
  update() {
    this.lastPosition.set(this.position);
    this.velocity.add(this.acceleration).limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);

    this.life++;
    if (this.life > this.maxLife) this.reset();
  }

  // I gave the canvas a margin here to make it look more like an artpiece
  checkBorders() {
    if (this.position.x < margin) {
      this.position.x = width - margin;
      this.lastPosition.x = this.position.x;
    } else if (this.position.x > width - margin) {
      this.position.x = margin;
      this.lastPosition.x = this.position.x;
    }
    if (this.position.y < margin) {
      this.position.y = height - margin;
      this.lastPosition.y = this.position.y;
    } else if (this.position.y > height - margin) {
      this.position.y = margin;
      this.lastPosition.y = this.position.y;
    }
  }
  draw() {
    const t = this.life / this.maxLife;
    const w = max(0.7, this.maxW * easeInOut(t));

    stroke(this.c);
    strokeWeight(w);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    noFill();
    line(
      this.lastPosition.x,
      this.lastPosition.y,
      this.position.x,
      this.position.y
    );

    frameCounter++;
    if (frameCounter > maxFrames) {
      noLoop();
      console.log("Drawing complete");
    }
  }
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  pixelDensity(1);
  background("#fdf6e3");
  computeGrid();
  generateField();
  generateAgents();
}

function draw() {
  for (const agent of agents) {
    const cx = constrain(floor(agent.position.x / fieldSize), 0, cols - 1);
    const cy = constrain(floor(agent.position.y / fieldSize), 0, rows - 1);
    const desiredDirection = field[cx][cy];

    agent.follow(desiredDirection);
    agent.update();
    agent.checkBorders();
    agent.draw();
  }
}

function computeGrid() {
  cols = max(1, floor(width / fieldSize));
  rows = max(1, floor(height / fieldSize));
  field = Array.from({ length: cols }, () => Array(rows));
}

function generateField() {
  noiseDetail(4, 0.5);
  noiseSeed(Math.random() * 100);
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const n = noise(
        (x * fieldSize * noiseScale) / divider,
        (y * fieldSize * noiseScale) / divider,
        zOff
      );
      const angle = n * TWO_PI;
      field[x][y] = p5.Vector.fromAngle(angle);
    }
  }
}

function generateAgents() {
  agents.length = 0;
  for (let i = 0; i < agentNum; i++) {
    const x = random(margin, width - margin);
    const y = random(margin, height - margin);
    agents.push(new Agent(x, y, maxSpeed, maxForce));
  }
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
  background("#fdf6e3");
  computeGrid();
  generateField();
  generateAgents();
}
