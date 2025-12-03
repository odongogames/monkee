/// <reference path="../../types/phaser.d.ts" />

export class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    // this.add.image(512, 384, 'background');

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(constants.worldSize.width / 2, 284, 468, 32).setStrokeStyle(2, constants.colors.darkbrown);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(constants.worldSize.width / 2 - 230, 284, 4, 28, constants.colors.darkbrown);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on('progress', (progress) => {

      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + (460 * progress);

    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.loadImages();
    this.loadFonts();
    this.loadSounds();
    // this.load.image('star', 'star.png');
    // this.load.image('bomb', 'bomb.png');
    // this.load.spritesheet(
    //     'dude',
    //     'dude.png',
    //     { frameWidth: 32, frameHeight: 48 }
    // );
  }

  loadImages()
  {
    this.load.setPath('assets/png');

    this.load.image('banana', 'banana.png');
    this.load.image('blue_bg', 'blue_bg.png');
    this.load.image('branch-2', 'branch-2.png');
    this.load.image('branch-3', 'branch-3.png');
    this.load.image('branch-4', 'branch-4.png');
    this.load.image('brown', 'brown.png');
    this.load.image('darkbrown', 'darkbrown.png');
    this.load.image('darkbrownwide', 'dark_brown_wide.png');
    this.load.image('green', 'green.png');
    this.load.image('grid', 'grid.png');
    this.load.image('indicator', 'indicator.png');
    this.load.image('monkey', 'monkee.png');
    this.load.image('pixel', 'pixel.png');
    this.load.image('red', 'red.png');
    this.load.image('reset', 'reset.png');
    this.load.image('reticle', 'reticle.png');
    this.load.image('spike', 'spike.png');
    this.load.image('treetop-4', 'treetop-4.png');
    this.load.image('treetop-5', 'treetop-5.png');

    this.load.setPath('assets/screens');

    this.load.image('main_menu', 'Monkee_main_menu.png');
    this.load.image('help_one', 'Monkee_help.png');
    this.load.image('game_over', 'Monkee_game_over.png');
    this.load.image('win_screen', 'Monkee_win_screen.png');
  }

  loadFonts() {
    this.load.setPath('assets/fonts');

    this.load.bitmapFont(
      "arcade",
      "arcade.png",
      "arcade.xml"
    );
    
    this.load.bitmapFont(
      "big_arcade",
      "arcade_1_0.png", //"arcade_0_0.png", //"arcade.png",
      "arcade_1.fnt" //"arcade_0.fnt", //"arcade.xml"
    );
  }

  loadSounds()
  {
    this.load.setPath('assets/sounds');

    this.load.audio("collect", "collect.mp3");
    this.load.audio("die", "die.mp3");
    this.load.audio("done", "done.mp3");
    this.load.audio("jump", "jump.mp3");
    // this.load.audio("select", "select.mp3");
    this.load.audio("select", "select_2.mp3");
    this.load.audio("win", "win.mp3");
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start('MainMenu');
  }
}
