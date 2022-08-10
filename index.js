let rows = 25,
  cols = 25,
  grid = [],
  openSet = [],
  closedSet = [],
  start,
  end,
  w,
  h,
  path = [];

class Spot {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous = undefined;
  }

  show(colo) {
    fill(colo);
    noStroke();
    rect(this.i * w, this.j * h, w - 1, h - 1);
  }

  addNeighbors(grid) {
    let i = this.i;
    let j = this.j;
    if (i < cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
  }
}

function setup() {
  createCanvas(800, 800);
  console.log("A*");

  w = width / cols;
  h = height / rows;

  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }

  start = grid[0][0];
  end = grid[cols - 1][rows - 1];
  openSet.push(start);

  console.log(grid);
}

function draw() {
  if (openSet.length > 0) {
    let winner = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }

    var current = openSet[winner];

    if (current === end) {
      noLoop();
      console.log("DONE!");
    }

    removeFromArray(openSet, current);
    closedSet.push(current);

    let neighbors = current.neighbors;
    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];
      if (!closedSet.includes(neighbor)) {
        let tempG = current.g + 1;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
          }
        } else {
          neighbor.g = tempG;
          openSet.push(neighbor);
        }

        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.previous = current;
      }
      neighbor.g = current.g + 1;
    }
    // we can keep going
  } else {
    // no solution
  }

  background(0);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }

  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0));
  }

  for (let i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0));
  }

  // Find the path
  path = [];
  let temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }
  for (let i = 0; i < path.length; i++) {
    path[i].show(color(0, 0, 255));
  }
}

function heuristic(a, b) {
  // let d = dist(a.i, a.j, b.i, b.j);
  let d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}

function removeFromArray(arr, elt) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}
