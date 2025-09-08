/* This is a recreation of the artwork "https://joshuadavis.com/080-Infinite-Pressure",
In my perception, the art piece looks like columns of cirlces, 
with randomness deciding the widht and shape of the columns. */

const W = 500;
const H = 500;

const size = 30; // The avarege size of a circle
const gap = 8; // distance between the cirlces
const columnAmount = 7; //number of columns
const wobble = Math.random(); // random cirlce shape
const colourPalette = ["#19232e", "#c9d6df", "#f2efe9", "#d6b588"]; // Colours of the columns
const bottomMargin = 30;

function setup() {
  createCanvas(W, H);
  noLoop();
}

/* Got inspiration for the gradient from this youtube video:
https://youtu.be/-MUOweQ6wac?si=DJdOJcCxr5d3lKMT */
function draw() {
  drawGradient(color("#ffffff"), color("red"));
  /* Here I center everything in the middle 
  and space the columns evenly across the canvas*/
  for (let i = 0; i < columnAmount; i++) {
    /* I'm not exactly sure how this works, but ChatGPT told me that I could use "map" in order to remap a number like this:
    map(value, start1, stop1, start2, stop2, [withinBounds]), and I used this source: https://p5js.org/reference/p5/map */
    const x = map(i + 0.5, 0, columnAmount, 70, W - 70) + random(-15, 15);
    const top = H * 0.1; // starting the column 10% down from the top
    const maxHeight = H - bottomMargin - top;
    const h = random(100, maxHeight); // Line 29 and 30 sets a margin at the bottom of the canvas
    drawColumn(x, top, h);
  }
}

// Making the background gradient
function drawGradient(topCol, botCol) {
  for (let y = 0; y < H; y++) {
    stroke(lerpColor(topCol, botCol, y / (H - 1)));
    line(0, y, W, y);
  }
}

// Drawing the columns made of cirlces
function drawColumn(cx, top, heightPx) {
  noStroke();

  const c1 = color(random(colourPalette));
  const c2 = color(random(colourPalette));

  // This line ensures that all columns has a different amount of perlin noise
  const nOff = random(1000);

  /* This works in the way that a column is looped from "top" to "top + heightPx" in steps of "gap"
  at each step, an ellipse is drawn so that each column is a stack of ellipses.
  "gap" defines the amount of ellipses */
  for (let y = top; y < top + heightPx; y += gap) {
    const t = (y - top) / heightPx;
    const baseProfile = sin(t * PI); // This makes the column thin at the top and bottom and bulge in the middle
    const noisy = noise(nOff + t * 2.0); //nOff makes each columns noise different, using Perlin noise
    const profile = lerp(baseProfile, noisy, wobble); // wobble = 0 gives a smooth column whilst wobble = 1 gives a noisy column

    const r = size * (0.5 + profile * 0.8); // circle width
    const ry = r * 0.7; // circle height

    // Together with line 47 and 48, this chooses 2 colours from my palette at random and creates a gradient for the column
    fill(lerpColor(c1, c2, t));
    ellipse(cx, y, r * 2, ry);
  }
}
