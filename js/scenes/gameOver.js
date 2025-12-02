/// <reference path="../../types/phaser.d.ts" />

import { Button } from '../gameobjects/button.js';

export class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create() {
    // this.cameras.main.setBackgroundColor(constants.colors.blue);

    // this.refImage = this.add.sprite(
    //   constants.worldSize.width / 2, 
    //   constants.worldSize.height / 2, 
    //   'win_screen' //'game_over'
    // );
    // this.refImage.setDepth(1000);
    // this.refImage.setAlpha(0.25);

    this.loadAudios();

    var playerScore = this.registry.get(constants.variableNames.score); 
    var scoreToWin = this.registry.get(constants.variableNames.scoreToWin);
    this.spawningBananas = false;

    if(playerScore >= scoreToWin)
    {
      this.showWinScreen();
    }
    else
    {
      this.showResult();
    }

    this.continueButton = new Button(
      this,                 
      constants.worldSize.width / 2,    
      415,
      playerScore >= scoreToWin ? "YES!" : "OKAY",                  
      constants.textSizes.large,                   
      constants.colors.blue, 
      constants.colors.darkbrown
    );
    this.continueButton.background.on("pointerdown", () => {
      this.playAudio('select');
      this.scene.start('MainMenu');
    });
  }

  update()
  {
    if(this.spawningBananas)
    {
      for(var i = this.bananas.length - 1; i > -1; i--)
      {
        if(this.bananas[i] != null && this.bananas[i].active)
        {
          var banana = this.bananas[i];

          if(banana.y > constants.worldSize.height + 200)
          {
            // console.log("destroy banana [" + i + "]");
            banana.destroy();
          }
        }
      };
    }
  }

  showWinScreen()
  {
      // console.log("Player has won");

    var text = this.add
      .bitmapText(constants.worldSize.width / 2, 320, "arcade", "YOU\nWIN", constants.textSizes.x_large)
      .setOrigin(0.5, 1)
      .setTint(constants.colors.darkbrown);  

    this.totalBananas = 100;
    this.bananaCount = 0;
    this.bananas = []
    this.spawningBananas = true;

    this.playAudio('win');
    this.spawnBanana();
  }

  spawnBanana()
  {
    if(this.bananaCount >= this.totalBananas)
    {
      return;
    }

    this.time.delayedCall(
      50,
      () => {
        // console.log("Spawn banana [" + this.bananaCount + "]");

        var banana = this.physics.add.sprite(
          Phaser.Math.Between(0, constants.worldSize.width),
          constants.worldSize.height - 20,
          'banana'
        ).setDepth(1000);
        banana.body.setVelocityY(Phaser.Math.Between(-150, -750));
        banana.body.setVelocityX(Phaser.Math.Between(-250, 250));
        this.bananas[this.bananas.length] = banana;
        // banana.setGravity(100);
        // this.bananas.add(banana);

        this.bananaCount++;

        this.spawnBanana();
      },
      null,
      this
    );
  }

  showResult()
  {
    // console.log("Player has not won");  

    var text = this.add
      .bitmapText(constants.worldSize.width / 2, 110, "arcade", "YOU HAVE FOUND", constants.textSizes.normal)
      .setOrigin(0.5, 1)
      .setTint(constants.colors.darkbrown);  

    var score = this.registry.get(constants.variableNames.score);
    var scoreText = this.add
      .bitmapText(constants.worldSize.width / 2, 320, "arcade", score, constants.textSizes.xx_large)
      .setOrigin(0.5, 1)
      .setTint(constants.colors.darkbrown);

    var text2 = this.add
      .bitmapText(constants.worldSize.width / 2, 345, "arcade", "BANANAS", constants.textSizes.normal)
      .setOrigin(0.5, 1)
      .setTint(constants.colors.darkbrown);  

    this.playAudio('done');
  }

  loadAudios() {
    this.audios = {
      done: this.sound.add("done"),      
      select: this.sound.add("select"),
      win: this.sound.add("win"),
    }
  };

  playAudio(key) {
    if(!this.registry.get(constants.variableNames.soundEnabled)) return;
    // console.log("Play ", key);

    this.audios[key].play();
  }
}
