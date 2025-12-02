import { Button } from './button.js';
import { ImageButton } from './imageButton.js';

export class PracticeUI extends Phaser.GameObjects.Container {
  constructor(scene, player, x, y) {
    super(scene, x, y);
    // this.setAlpha(0);
    this.x = x;
    this.y = y;
    this.width = constants.worldSize.width;
    this.height = constants.worldSize.height;
    this.scene = scene;

    this.loadAudios();
    // console.log(this);

    // this.refImage = this.scene.add.sprite(this.width / 2, this.height / 2, 'help_one');
    // this.refImage.setDepth(1000);
    // this.refImage.setAlpha(0.25);

    this.blueBG = this.scene.add.sprite(this.width / 2, this.height / 2, 'blue_bg');
    this.blueBG.setDepth(90);
    this.blueBG.setAlpha(0);

    this.helpOne = {
      top: "CLICK AND DRAG MOUSE\nBUTTON TO START AIMING",
      bottom: "RELEASE MOUSE TO JUMP"
    };

    this.helpTwo = {
      top: "PRESS LEFT ARROW OR\nA KEY TO WALK LEFT",
      bottom: "PRESS RIGHT ARROW OR\nD KEY TO WALK RIGHT",
    };

    this.helpThree = {
      top: "COLLECT AS MANY\nMANY BANANA AS YOU CAN",
      bottom: "DON’T TOUCH\nTHE SPIKES!"
    };

    this.helpTextTop = this.scene.add
      .bitmapText(this.width / 2, 150, "arcade", "TOP", constants.textSizes.normal)
      .setOrigin(0.5, 1)
      .setDepth(100)
      .setAlpha(0)
      .setTint(constants.colors.darkbrown);


    this.helpTextBottom = this.scene.add
      .bitmapText(this.width / 2, 250, "arcade", "BOTTOM", constants.textSizes.normal)
      .setOrigin(0.5, 1)
      .setDepth(100)
      .setAlpha(0)
      .setTint(constants.colors.darkbrown);

    this.states = {
      home:       0,
      help_one:   1,
      help_two:   2,
      help_three: 3
    }

    this.currentState = this.states.home;

    scene.add.existing(this);

    this.title = this.scene.add
      .bitmapText(this.width / 2, 50, "arcade", "PRACTICE MODE", constants.textSizes.normal)
      .setOrigin(0.5, 1)
      .setTint(constants.colors.darkbrown)
      .setDepth(200);

    this.leftButton = new Button(
      this.scene,                 
      100,    
      462,
      "BACK",                  
      constants.textSizes.medium,                   
      constants.colors.blue, 
      constants.colors.darkbrown
    );
    this.leftButton.background.on("pointerdown", () => {
      this.playAudio('select');
      
      switch(this.currentState)
      {
        case this.states.home:
          scene.scene.start("MainMenu");
          break;

        case this.states.help_one:
          this.hideHelpPage();
          break;

        case this.states.help_two:
          this.showHelpPage(1);
          break;

        case this.states.help_three:
          this.showHelpPage(2);
          break;

        default:
          console.log("Nothing");
          break;
      }
    });

    this.rightButton = new Button(
      this.scene,                 
      constants.worldSize.width - 100,    
      462,
      "HELP",                  
      constants.textSizes.medium,                   
      constants.colors.blue, 
      constants.colors.darkbrown
    );
    this.rightButton.background.on("pointerdown", () => {
      this.playAudio('select');
      switch(this.currentState)
      {
        case this.states.home:
          this.showHelpPage(1);
          break;

        case this.states.help_one:
          this.showHelpPage(2);
          break;

        case this.states.help_two:
          this.showHelpPage(3);
          break;

        case this.states.help_three:
          this.hideHelpPage();
          break;

        default:
          console.log("Nothing");
          break;
      }
    });

    this.resetButton = new ImageButton(
      this.scene,                 
      constants.worldSize.width / 2,    
      462,
      'reset'
    );
    this.resetButton.image.on("pointerdown", () => {
      scene.registry.set(constants.variableNames.gameMode, constants.gameMode.practice);
      this.playAudio('jump');

      scene.scene.start("Game");
    });

    this.helpIndexText = this.scene.add
      .bitmapText(this.width / 2, 475, "arcade", "1 OF 3", constants.textSizes.normal)
      .setOrigin(0.5, 1)
      .setTint(constants.colors.darkbrown)
      .setAlpha(0)
      .setDepth(200);
  }

  showHelpPage(page)
  {
    this.title.setAlpha(0);
    this.blueBG.setAlpha(1);
    this.helpTextTop.setAlpha(1);
    this.helpIndexText.setAlpha(1);
    this.helpTextBottom.setAlpha(1);
    this.resetButton.image.setAlpha(0);
    this.resetButton.image.removeInteractive();

    this.helpIndexText.text = page + " OF 3";

    this.rightButton.textObject.text = "NEXT";

    // console.log("Show help menu page: " + page);
    switch (page)
    {
      case 1:
        this.helpTextTop.text = this.helpOne.top;
        this.helpTextBottom.text = this.helpOne.bottom;

        this.currentState = this.states.help_one;
        break;

      case 2:
        this.helpTextTop.text = this.helpTwo.top;
        this.helpTextBottom.text = this.helpTwo.bottom;

        this.currentState = this.states.help_two;
        break;

      case 3:
        this.helpTextTop.text = this.helpThree.top;
        this.helpTextBottom.text = this.helpThree.bottom;

        this.currentState = this.states.help_three;
        break;

      default:
        console.log("No help page");
        break;
    }
  }

  hideHelpPage()
  {
    this.title.setAlpha(1);
    this.blueBG.setAlpha(0);
    this.resetButton.image.setAlpha(1);
    this.resetButton.image.setInteractive();
    this.helpIndexText.setAlpha(0);
    this.helpTextTop.setAlpha(0);
    this.helpTextBottom.setAlpha(0);

    this.rightButton.textObject.text = "HELP";

    this.currentState = this.states.home;
  }

  loadAudios() {
    this.audios = {
      jump: this.scene.sound.add("jump"),
      select: this.scene.sound.add("select"),
    }
  };

  playAudio(key) {
    // console.log("Play ", key);
    if(!this.scene.registry.get(constants.variableNames.soundEnabled)) return;

    this.audios[key].play();
  }
}