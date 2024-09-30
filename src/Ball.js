import { Bodies, Body, Composite } from "matter-js";

class Ball {
  moveBallRef = this.moveBall.bind(this);
  constructor(game) {
    this.game = game;
    this.world = game.world;

    this.onInit();
  }
  onInit() {
    this.drawBall();
    document.addEventListener("keydown", this.moveBallRef);
  }
  removeEventListner() {
    document.removeEventListener("keydown", this.moveBallRef);
  }

  drawBall() {
    const ballPositionY = this.game.cellLengthY / 2;
    const ballPositionX = this.game.cellLengthX / 2;
    const ballRadius =
      Math.min(this.game.cellLengthY, this.game.cellLengthY) / 5;
    this.ball = Bodies.circle(ballPositionX, ballPositionY, ballRadius, {
      render: { fillStyle: "#74c0fc" },
      label: "ball",
    });
    Composite.add(this.world, this.ball);
  }

  moveBall(e) {
    console.log(this, "t6");
    const { x, y } = this.ball.velocity;

    switch (e.key) {
      case "ArrowUp":
        Body.setVelocity(this.ball, { x, y: y - 5 });
        break;
      case "ArrowDown":
        Body.setVelocity(this.ball, { x, y: y + 5 });
        break;
      case "ArrowLeft":
        Body.setVelocity(this.ball, { x: x - 5, y });
        break;
      case "ArrowRight":
        Body.setVelocity(this.ball, { x: x + 5, y });
        break;
    }
  }
}

export default Ball;
