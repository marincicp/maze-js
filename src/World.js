import { Body, Engine, Events, Render, Runner } from "matter-js";
import { HEIGHT, startGameSetup, WIDTH } from "./config";
import Ball from "./Ball";
import Walls from "./Walls";
import Goal from "./Goal";
import { createGridArr, shuffle } from "./helper";

class World {
  engine = Engine.create();
  world = this.engine.world;
  width = WIDTH;
  height = HEIGHT;
  // cells_horizontal = CELLS_HORIZONTAL;
  // cells_vertical = CELLS_VERTICAL;

  gameEl = document.querySelector(".gameBox");

  constructor(game) {
    this.cells_horizontal = startGameSetup[game.level].CELLS_HORIZONTAL;
    this.cells_vertical = startGameSetup[game.level].CELLS_VERTICAL;
    console.log(startGameSetup[game.level].CELLS_VERTICAL, "koko");
    this.cellLengthX = this.width / this.cells_horizontal;
    this.cellLengthY = this.height / this.cells_vertical;
    this.walls = new Walls(this);
    // this.onInit();
    this.ball = new Ball(this);
    this.goal = new Goal(this);
    this.game = game;
    this._isGameOver = false;
  }

  onInit() {
    this.initWorld();
    this.startGame();
  }

  destroy() {
    Events.off(this.engine);
    this.gameEl.innerHTML = "";
    this.ball = null;
    this.goal = null;
    this.walls = null;
  }
  startGame() {
    const startRow = Math.floor(Math.random() * this.cells_vertical);
    const startColumn = Math.floor(Math.random() * this.cells_horizontal);
    this.createGridArray();

    this.stepThroughCell(startRow, startColumn);
    this.walls.drawWalls();
    this.collisionCheck();
  }

  restatGame() {
    console.log(this, "this 1");
    this.goal = null;
    this.ball = null;

    this.goal = new Goal(this);
    this.ball = new Ball(this);
    console.log(this, "this 2");
  }

  initWorld() {
    this.render = this.createEngine();
    Render.run(this.render);
    Runner.run(Runner.create(), this.engine);

    this.engine.gravity.y = 0;
  }

  createEngine() {
    return Render.create({
      element: this.gameEl,
      engine: this.engine,
      options: {
        wireframes: false,
        width: 600,
        height: 600,
      },
    });
  }

  createGridArray() {
    this.grid = createGridArr(this.cells_vertical, this.cells_horizontal);
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
        nextRow >= this.cells_vertical ||
        nextColumn >= this.cells_horizontal
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

  collisionCheck() {
    Events.on(this.engine, "collisionStart", (e) => {
      e.pairs.forEach((collision) => {
        const labels = ["ball", "goal"];
        if (
          labels.includes(collision.bodyA.label) &&
          labels.includes(collision.bodyB.label)
        ) {
          this.game.gameOver();
          this.engine.gravity.y = 1;
          //todo
          // this.ball.removeEventListner();
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

export default World;
