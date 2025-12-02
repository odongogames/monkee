import { Button } from '../gameobjects/button.js';

export class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "MainMenu" });
  }

  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;

    // this.time.delayedCall(1000, () => this.showInstructions(), null, this);

    // this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
    // this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
    // this.playMusic();
    this.showMainMenu();

    // this.refImage = this.add.sprite(this.center_width, this.center_height, 'main_menu');
    // this.refImage.setDepth(1000);
    // this.refImage.setAlpha(0.25);

    // console.log(this.registry.list);
  }

  startGame() {
    // console.log("Try start game");
    // return;

    this.registry.set(constants.variableNames.gameMode, constants.gameMode.normal);
    // if (this.theme) this.theme.stop();
    this.scene.start("Game");
  }

  startPractice() {
    // console.log("Try start practice");

    this.registry.set(constants.variableNames.gameMode, constants.gameMode.practice);

    this.scene.start("Game");
  }

  toggleSound() {
    // var bool = this.registry.get(constants.variableNames.soundEnabled);

    this.registry.set(
      constants.variableNames.soundEnabled, 
      !this.registry.get(constants.variableNames.soundEnabled)
    );

    this.soundButton.textObject.text = 
      this.registry.get(constants.variableNames.soundEnabled) ? "SOUND: ON" : "SOUND: OFF";

    console.log("toggle sound: ", this.registry.get(constants.variableNames.soundEnabled));
  }

  /*
    Helper function to show the title letter by letter
    */
  showMainMenu() {
    var copyright = this.add
      .bitmapText(this.center_width, 50, "arcade", "2025 (c) ODONGO GAMES", constants.textSizes.small)
      .setOrigin(0.5, 1)
      .setTint(constants.colors.darkbrown);

    var title = this.add
      .bitmapText(this.center_width, 200, "arcade", "MONKEE", constants.textSizes.x_large)
      .setOrigin(0.5, 1)
      .setTint(constants.colors.darkbrown);

    this.playButton = new Button(
      this,                 
      this.center_width,    
      270,
      "PLAY",                  
      constants.textSizes.large,                   
      constants.colors.blue, 
      constants.colors.darkbrown
    );
    this.playButton.background.on("pointerdown", () => {
      this.startGame();
    });

    this.practiceButton = new Button(
        this,                 
        this.center_width,    
        350,
        "PRACTICE",                  
        constants.textSizes.large,                   
        constants.colors.blue, 
        constants.colors.darkbrown
      );
    this.practiceButton.background.on("pointerdown", () => {
      this.startPractice();
    });

    this.soundButton = new Button(
        this,                 
        this.center_width,    
        450,
        this.registry.get(constants.variableNames.soundEnabled) ? "SOUND: ON" : "SOUND: OFF",
        constants.textSizes.normal,                   
        constants.colors.blue, 
        constants.colors.darkbrown
      );
    this.soundButton.background.on("pointerdown", () => {
      this.toggleSound();
    });
    // this.tweens.add({
    //   targets: this.space,
    //   duration: 300,
    //   alpha: { from: 0, to: 1 },
    //   repeat: -1,
    //   yoyo: true,
    // });
  }

  // playMusic(theme = "splash") {
  //   this.theme = this.sound.add(theme);
  //   this.theme.stop();
  //   this.theme.play({
  //     mute: false,
  //     volume: 1,
  //     rate: 1,
  //     detune: 0,
  //     seek: 0,
  //     loop: true,
  //     delay: 0,
  //   });
  // }
}
