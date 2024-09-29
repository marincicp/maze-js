import { Body, Engine, Events, Render, Runner } from "matter-js";
import { CELLS_HORIZONTAL, CELLS_VERTICAL, HEIGHT, WIDTH } from "./config";
import { createGridArr, shuffle } from "./helper";
import Walls from "./Walls";
import Ball from "./Ball";
import Goal from "./Goal";

class Game {
  engine = Engine.create();
  world = this.engine.world;
  width = WIDTH;
  height = HEIGHT;
  cells_horizontal = CELLS_HORIZONTAL;
  cells_vertical = CELLS_VERTICAL;

  constructor() {
    this.cellLengthX = this.width / this.cells_horizontal;
    this.cellLengthY = this.height / this.cells_vertical;

    this.walls = new Walls(this);
    this.onInit();

    this.ball = new Ball(this);
    new Goal(this);
  }

  onInit() {
    this.initWorld();

    this.startGame();
  }

  startGame() {
    const startRow = Math.floor(Math.random() * this.cells_vertical);
    const startColumn = Math.floor(Math.random() * this.cells_horizontal);
    this.createGridArray();

    this.stepThroughCell(startRow, startColumn);
    this.walls.drawWalls();
    this.collisionCheck();
  }

  initWorld() {
    this.render = this.createEngine();
    Render.run(this.render);
    Runner.run(Runner.create(), this.engine);

    this.engine.gravity.y = 0;
  }

  createEngine() {
    return Render.create({
      //   element: document.body,
      element: document.querySelector(".game"),
      engine: this.engine,
      options: {
        wireframes: false,
        width: 600,
        height: 600,
      },
    });
  }

  createGridArray() {
    this.grid = createGridArr(CELLS_VERTICAL, CELLS_HORIZONTAL);
    console.log(this.grid, "2");
  }

  stepThroughCell(row, column) {
    // If cell at [row, column] visited, return
    if (this.grid[row][column]) return;

    // Mark this cell as being visited
    this.grid[row][column] = true;

    // Assemble randomly ordered list of neighbors
    const neighbors = shuffle([
      [row - 1, column, "up"],
      [row + 1, column, "down"],
      [row, column - 1, "left"],
      [row, column + 1, "right"],
    ]);

    for (const neighbor of neighbors) {
      const [nextRow, nextColumn, direction] = neighbor;

      // Check if that neighbor is out of bounds
      if (
        nextRow < 0 ||
        nextColumn < 0 ||
        nextRow >= CELLS_VERTICAL ||
        nextColumn >= CELLS_HORIZONTAL
      ) {
        continue;
      }
      // If we have visited neighbor, continue to next  neighbor
      if (this.grid[nextRow][nextColumn]) {
        continue;
      }

      // Remove a wall from either horizontals or verticals
      switch (direction) {
        case "left":
          this.walls.verticalWalls[row][column - 1] = true;
          break;
        case "right":
          this.walls.verticalWalls[row][column] = true;
          break;
        case "up":
          this.walls.horizontalWalls[row - 1][column] = true;
          break;
        case "down":
          this.walls.horizontalWalls[row][column] = true;
          break;
        default:
          throw new Error("Invalid direction");
      }

      // Visit that next cell
      this.stepThroughCell(nextRow, nextColumn);
    }
  }

  // TODO zavrsiti
  gameOver() {}

  collisionCheck() {
    const modal = document.querySelector(".modal");
    Events.on(this.engine, "collisionStart", (e) => {
      e.pairs.forEach((collision) => {
        const labels = ["ball", "goal"];
        if (
          labels.includes(collision.bodyA.label) &&
          labels.includes(collision.bodyB.label)
        ) {
          console.log(this.engine);
          this.engine.gravity.y = 1;
          this.ball.removeEventListner();
          this.world.bodies.forEach((body) => {
            if (body.label === "wall") {
              Body.setStatic(body, false);
            }
          });
        }
      });
    });
  }
}

const game = new Game();
