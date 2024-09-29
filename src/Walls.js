import { Bodies, Composite } from "matter-js";
import { createGridArr } from "./helper";

class Walls {
  verticalWalls = [];
  horizontalWalls = [];

  constructor(game) {
    this.game = game;

    this.world = game.world;
    this.onInit();
  }

  onInit() {
    this.createWalls();
    this.createHorizontalWallsArr();
    this.createVerticalsWallsArr();
  }

  drawWalls() {
    this.drawHorizontalWalls();
    this.drawVerticalWalls();
  }

  createWalls() {
    const walls = [
      Bodies.rectangle(this.game.width / 2, 0, this.game.width, 5, {
        isStatic: true,
      }),
      Bodies.rectangle(
        this.game.width / 2,
        this.game.height,
        this.game.width,
        5,
        {
          isStatic: true,
        }
      ),
      Bodies.rectangle(0, this.game.height / 2, 5, this.game.height, {
        isStatic: true,
      }),
      Bodies.rectangle(
        this.game.width,
        this.game.height / 2,
        5,
        this.game.height,
        {
          isStatic: true,
        }
      ),
    ];

    Composite.add(this.world, walls);
  }

  createVerticalsWallsArr() {
    this.verticalWalls = createGridArr(
      this.game.cells_vertical,
      this.game.cells_horizontal - 1
    );
  }

  createHorizontalWallsArr() {
    this.horizontalWalls = createGridArr(
      this.game.cells_vertical - 1,
      this.game.cells_horizontal
    );
  }

  drawVerticalWalls() {
    console.log(this.verticalWalls, "mm");
    this.verticalWalls.forEach((row, rowIndex) => {
      row.forEach((isWallOpen, columnIndex) => {
        if (isWallOpen) return;

        Composite.add(
          this.world,
          Bodies.rectangle(
            columnIndex * this.game.cellLengthX + this.game.cellLengthX,
            rowIndex * this.game.cellLengthY + this.game.cellLengthY / 2,
            10,
            this.game.cellLengthY,
            {
              label: "wall",
              isStatic: true,
              render: {
                fillStyle: "#ced4da",
              },
            }
          )
        );
      });
    });
  }

  drawHorizontalWalls() {
    console.log(this.verticalWalls, "mm");
    this.horizontalWalls.forEach((row, rowIndex) => {
      row.forEach((isWallOpen, columnIndex) => {
        if (isWallOpen) return;
        Composite.add(
          this.world,
          Bodies.rectangle(
            columnIndex * this.game.cellLengthX + this.game.cellLengthX / 2,
            rowIndex * this.game.cellLengthY + this.game.cellLengthY,
            this.game.cellLengthX,
            10,
            {
              isStatic: true,
              label: "wall",
              render: {
                fillStyle: "#ced4da",
              },
            }
          )
        );
      });
    });
  }
}

export default Walls;
