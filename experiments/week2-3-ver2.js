const palette = [
  "#e63946", // Red
  "#f1c40f", // Yellow
  "#2a9d8f", // Light blue
  "#264653", // Dark blue
  "#1583c2", // Normal blue
  "#ef8354", // Orange
  "#6d4c41", // Brown
];

class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.lastPosition = this.position.copy();

    const a = Math.random() * Math.PI * 2;
    const v = 0.2 + Math.random();

    this.velocity = createVector(Math.cos(a) * v, Math.sin(a) * v);
    this.lifespan = 100 + Math.random() * 100;
  }

  update() {
    this.lifespan--;

    this.velocity.mult(1.1);
    this.lastPosition.set(this.position);
    this.position.add(this.velocity);
  }

  draw() {
    stroke(color(random(palette)));
    strokeWeight(2);
    line(
      this.lastPosition.x,
      this.lastPosition.y,
      this.position.x,
      this.position.y
    );
  }

  isDead() {
    return this.lifespan <= 0;
  }
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  background("#f8f5ee");
}

function generateParticles(x, y) {
  for (let i = 0; i < 50; i++) {
    const px = x + random(-1, 1);
    const py = y + random(-1, 1);
    const particle = new Particle(px, py);
    particles.push(particle);
  }
}

let particles = [];

function draw() {
  for (let particle of particles) {
    particle.update();
    particle.draw();

    if (particle.isDead()) {
      particles.splice(particles.indexOf(particle), 1);
    }
  }
}

function mouseClicked() {
  generateParticles(mouseX, mouseY);
}
