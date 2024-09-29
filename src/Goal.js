import { Bodies, Composite } from "matter-js";

class Goal {
  constructor(game) {
    this.game = game;

    this.drawGoal();
  }

  drawGoal() {
    const goalPositionX = this.game.width - this.game.cellLengthX / 2;
    const goalPositionY = this.game.height - this.game.cellLengthY / 2;
    this.goal = Bodies.rectangle(
      goalPositionX,
      goalPositionY,
      this.game.cellLengthX / 4,
      this.game.cellLengthY / 4,
      { label: "goal", render: { fillStyle: "#a9e34b" } }
    );

    Composite.add(this.game.world, this.goal);
  }
}

export default Goal;
