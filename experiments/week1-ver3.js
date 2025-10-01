/* For this recreation, I have used the lecture example: 
https://codepen.io/pixelkind/pen/WNLraMw */

const size = 22;
const columns = 12;
const rows = 22;
const gap = 0;

// Adding a color palette
let palette = [];

function setup() {
  createCanvas(innerWidth, innerHeight);
  rectMode(CENTER);
  noLoop();
  palette = [
    color("#ff0000"),
    color("#ff7f00"),
    color("#ffff00"),
    color("#00ff00"),
    color("#0000ff"),
    color("#8b00ff"),
  ];
}

function draw() {
  background("#ffffff");
  noStroke();

  // Starting to draw at the center position
  let y = (height - size * rows - gap * (rows - 1)) / 2 + size / 2;

  for (let i = 0; i < rows; i++) {
    let x = (width - size * columns - gap * (columns - 1)) / 2 + size / 2;

    // As I go down the canvas, row number increases, and t value increases
    const t = (i + 1) / rows;

    for (let k = 0; k < columns; k++) {
      // This cycles the colours so that the rainbow repeats across the row
      let baseColour = palette[k % palette.length];

      /* If the random value given is larger than smaller than t, 
      the code will choose a colour from the palette at random, 
      meaning that the higher the number of the row is, the higher
      the probability of getting a random coloured square is */
      if (random() < t) {
        baseColour = palette[int(random(palette.length))];
      }
      fill(baseColour);
      square(x, y, size);
      x += size + gap;
    }
    y += size + gap;
  }
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}
