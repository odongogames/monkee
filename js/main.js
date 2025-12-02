/// <reference path="../types/phaser.d.ts" />

// import { Phaser } from "phaser";
import { Boot } from './scenes/boot.js';
import { Game } from './scenes/game.js';
import { GameOver } from './scenes/gameOver.js';
import { MainMenu } from './scenes/mainMenu.js';
import { Preloader } from './scenes/preloader.js';

const config = {
  width: constants.worldSize.width,
  height: constants.worldSize.height,
  parent: 'container',
  backgroundColor: constants.colors.blue,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  autoRound: false,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: false,
    },
  },
  plugins: {},
  render: {
    pixelArt: true,
    // ...
  },
  scene: [
    Boot,
    MainMenu,
    Preloader,
    Game,
    GameOver,
  ]
};

const game = new Phaser.Game(config);
