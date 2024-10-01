import World from "./World";
import Observable, { Car } from "./Observable";

class Game {
  overlay = document.querySelector(".overlay");
  modal = document.querySelector(".modal-win");
  resetBtn = document.querySelector(".btn-reset");

  constructor(level = "easy") {
    this.isGameOverObserver = new Observable(false);
    this.level = level;
    this.world = new World(this);
  }

  onInit() {
    this.startGame();
  }

  startGame() {
    this.world.onInit();
  }

  gameOver() {
    console.log(this, "kkak");
    this.overlay.classList.remove("hidden");
    this.modal.classList.remove("hidden");
    this.resetBtn.removeEventListener("click", this.restartGame);
    this.resetBtn.addEventListener("click", this.restartGame.bind(this));
  }

  restartGame() {
    this.overlay.classList.add("hidden");
    this.modal.classList.add("hidden");

    if (this.world) {
      this.world.destroy();
    }

    this.world = new World(this);
    this.world.onInit();
  }
}

const gameLevel = document.querySelector("#game-level");
const gameBox = document.querySelector(".gameBox");
gameLevel.addEventListener("change", onSelectLevel);

let game = new Game();
game.startGame();

function onSelectLevel(e) {
  console.log(e.target.value);

  gameBox.innerHTML = "";
  game = null;
  game = new Game(e.target.value);
  game.startGame();
}
