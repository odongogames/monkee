/// <reference path="../../types/phaser.d.ts" />

import { Player } from '../gameobjects/player.js';
import { PracticeUI } from '../gameobjects/practiceUI.js';
import { Tree } from '../gameobjects/tree.js';
import { WorldGrid } from '../gameobjects/worldgrid.js';

export class Game extends Phaser.Scene {
  constructor() {
      super('Game');

      this.drawPath = false;
  }

  create() {    
    // console.log("Game mode: [" + this.registry.get(constants.variableNames.gameMode) + "]");

    this.hasBanana = false;
    this.timeLeft = constants.variables.totalPlayTime;
    this.lastPracticeTreeIndex = 1;
    this.registry.set(constants.variableNames.score, 0);

    this.loadAudios();

    this.ESC = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );
    
    // console.log("World size: ", constants.worldSize);
    // console.log(Math);

    // console.log(this.cameras.main);
    // this.cameras.main.scaleManager.scaleMode = 1;

    // this.cameras.main.zoomX = 0.5;
    // this.cameras.main.zoomY = 0.5;

    this.cameras.main.setBounds(0, 0, 20920 * 2, 20080 * 2);
    this.physics.world.setBounds(0, 0, 20920 * 2, 20080 * 2);

    this.player = new Player(
      this, 
      constants.gridSize * 2.5, 
      50
    ); 
    this.lastValidPlayerPosition = { x: 0, y: 0 };
    this.lastValidPlayerPosition.x = this.player.body.position.x;
    this.lastValidPlayerPosition.y = this.player.body.position.y;

    this.branches = this.physics.add.staticGroup();
    this.physics.add.collider(this.player, this.branches);

    this.bananas = this.physics.add.staticGroup();
    this.physics.add.overlap(this.player, this.bananas, this.collectBanana, null, this);

    this.trees = [];
    this.maxDistanceBetweenTrees = 9;
    this.lastTreePosition = 0;
    this.treeSpawnDistance = (constants.worldSize.unitWidth  / 2) * constants.gridSize; 

    switch(this.registry.get(constants.variableNames.gameMode))
    {
      case constants.gameMode.normal:
        this.minDistanceBetweenTrees = 6; 
        this.treeStartX =  2.5;
        this.isPracticeMode = false;
        this.timeLeftText =  this.add
          .bitmapText(constants.worldSize.width - 60, 485, "arcade", constants.variables.totalPlayTime, constants.textSizes.large)
          .setOrigin(0.5, 1)
          .setDepth(100)
          .setScrollFactor(0)
          .setTint(constants.colors.darkbrown);
        this.spikes = this.physics.add.staticGroup();
        this.spikeSpawnDistance = ((constants.worldSize.unitWidth  / 2) + 2) * constants.gridSize; 
        this.physics.add.overlap(this.player, this.spikes, this.touchSpike, null, this);
        for(var i = 0; i < 20; i++)
        {
          this.generateSpike();  
        }
        break;
      case constants.gameMode.practice:
        this.minDistanceBetweenTrees = 8; 
        this.treeStartX = 4;
        this.isPracticeMode = true;

        this.practiceUI = new PracticeUI(
          this,
          constants.worldSize.width / 2,
          constants.worldSize.height / 2
        );
        break;
    }

    for(var i = 0; i < 2; i++)
    {
      var spawnBanana = i == 0 ? false : true;

      this.generateTree(spawnBanana);  
    }

    if(!this.hasBanana)
    {
      // console.log("This scene has no banana. Adding one...");
      var tree = this.trees[this.lastPracticeTreeIndex];

      if(tree.branches.length == 1)
      {
        tree.addBanana(tree.branches[0]);
      }
      else if(tree.branches.length == 2)
      {
        var index = Math.random() > 0.5 ? 0 : 1;

        tree.addBanana(tree.branches[index]);
      }
      this.hasBanana = true;
    }

    
    // TODO: Die when touch ground
    this.platforms = this.physics.add.staticGroup();

    for(var i = 0; i < 20; i++)
    {
      var sprite = this.add.sprite(
        constants.worldSize.width / 2 + (constants.worldSize.width * i), 
        constants.gridSize * 11, 
        'green'
      );
      sprite.setScale(18, 2);
      this.platforms.add(sprite);
    }

    this.physics.add.collider(this.player, this.platforms);

    // input
    this.pointer = this.input.activePointer;
    // console.log(this.pointer);

    this.input.mouse.disableContextMenu();

    // aiming
    this.reticle = this.add.sprite(
      constants.gridSize * constants.worldSize.unitWidth / 2, 
      constants.gridSize * (constants.worldSize.unitHeight - 1), 
      'reticle'
    );
    this.reticle.setDepth(this.player.depth + 1);
    this.aimStartPosition = { x: 0, y: 0 };
    this.pointerStartPosition = { x: 0, y: 0 };

    // aim helper
    this.aimLine = [];
    for(var i = 0; i < 7; i++)
    {
      var sprite = this.add.sprite( 0, 0, 'pixel').setDepth(100);
      this.aimLine[this.aimLine.length] = sprite;
    }
    this.reticle.visible = false;

    this.addWorldBorders();

    // this.worldGrid = new WorldGrid(this, 0, 0, 10, 0.25);

    // banana icons
    this.bananaIcons = [];
    for(var i = 0; i < 15; i++)
    {
      var x = constants.gridSize + constants.gridSize * i;
      var y = (constants.worldSize.unitHeight * constants.gridSize) - constants.gridSize;
      var sprite = this.add.sprite(x, y, 'banana').setDepth(100).setScrollFactor(0);
      sprite.visible = false;
      this.bananaIcons[this.bananaIcons.length] = sprite;
    }

    // this.addDebugText();
    // this.addUIText();

    this.graphics = this.add.graphics();
    this.graphics.lineStyle(1, 0xffffff, 1); // for debug
    this.graphics.setDepth(90);

    this.normalisedAimDistance = 0;

    if(!this.isPracticeMode)
    {
      this.cameras.main.startFollow(this.player, true, 0.05, 0.05, -100, 240);
    }
  }

  collectBanana(player, banana)
  {
    // player.disableBody(true, true);
    // banana.disableBody(true, true);

    banana.destroy();

    if(this.isPracticeMode)
    {
      // respawn banana
      var index = this.lastPracticeTreeIndex == 1 ? 0 : 1;
      var tree = this.trees[index];
      this.lastPracticeTreeIndex = index;

      if(tree.branches.length == 1)
      {
        tree.addBanana(tree.branches[0]);
      }
      else if(tree.branches.length == 2)
      {
        var index = Math.random() > 0.5 ? 0 : 1;

        tree.addBanana(tree.branches[index]);
      }
    }
    else
    {
      this.registry.set(
        constants.variableNames.score, 
        this.registry.get(constants.variableNames.score) + 1
      );

      if(this.registry.get(constants.variableNames.score) < this.bananaIcons.length)
      {
        this.bananaIcons[this.registry.get(constants.variableNames.score) - 1].visible = true;
      }
    }

    this.playAudio('collect');
  }

  touchSpike()
  {
    // this.player.body.position = this.lastValidPlayerPosition;

    var closestDistance = 10000000;
    var closestIndex = -1;
    for(var i = 0; i < this.trees.length; i++)
    {
      var treePosition = { x: this.trees[i].x, y: this.trees[i].y };
      var subtract = vec2subtractvec2(this.lastValidPlayerPosition, treePosition)
      // console.log("Subtract: ", subtract.x, subtract.y);
      var distance = vec2magnitude(subtract);
      // console.log("Distance: " + distance);

      if(distance < closestDistance)
      {
        closestDistance = distance;
        closestIndex = i;
      }
    }

    // console.log("Closest index: [" + closestIndex + "]");
    this.lastValidPlayerPosition.x = this.trees[closestIndex].x;

    // console.log("Playe touch spike", this.player.body.position, this.lastValidPlayerPosition);

    this.player.body.x = this.lastValidPlayerPosition.x;
    this.player.body.y = this.lastValidPlayerPosition.y - 10;
    
    this.playAudio('die');
  }

  update(timestep, delta) {
    // this.cameras.main.x += -0.5;
    // this.cameras.main.x = constants.worldSize.width / 3 - this.player.body.x ;
    if (Phaser.Input.Keyboard.JustDown(this.ESC)) {
      this.playAudio('die');
      this.scene.start('MainMenu');
    }

    if(!this.isPracticeMode)
    {
      this.timeLeft -= delta / 1000;
      this.timeLeftText.text = Math.floor(this.timeLeft);

      if(this.timeLeft <= 0)
      {
        this.scene.start('GameOver');
      }

      if(this.player.body.x > this.lastTreePosition - this.treeSpawnDistance)
      {
        this.generateTree(true);
      }

      if(this.player.body.x > this.lastSpikePosition - this.spikeSpawnDistance)
      {
        this.generateSpike();
      }

      // this.debugText.text = this.lastSpikePosition;
      // this.debugText2.text = this.player.body.position.x;
    }


    this.player.update();

    if (this.path && this.drawPath) 
    {
      this.graphics.clear();
      this.path.draw(this.graphics);
    }

    // this.playerStateText.text = this.player.currentState;
    // this.playerStateText.text = this.player.body.blocked.down;
    // this.playerStateText.text = this.roundToTwoDecimalPlaces(this.normalisedAimDistance);
    // this.playerStateText.text = roundToTwoDecimalPlaces(this.player.body.velocity.y);
    // this.playerStateText.setPosition(
    //   this.player.body.position.x - 15, 
    //   this.player.body.position.y - 30
    // );

    if(!this.player.isDead() && this.player.body.blocked.down)
    {
      // this.lastValidPlayerPosition = this.player.body.position;
      this.lastValidPlayerPosition.x = this.player.body.position.x;
      this.lastValidPlayerPosition.y = this.player.body.position.y;
    }

    // this.debugText.text = "x: " + this.player.body.position.x + 
    //                       " y: " + this.player.body.position.y;

    // this.debugText2.text = "x: " + this.lastValidPlayerPosition.x + 
    //                       " y: " + this.lastValidPlayerPosition.y;

    switch(this.player.currentState)
    {
      case this.player.states.readyToJump:
        if(this.pointer.isDown)
        {
          if(this.isPracticeMode && this.pointer.y > 410)
          {
            return;
          }

          // this.reticle.visible = true;
          this.reticle.x = this.player.body.x + this.player.body.width / 2;
          this.reticle.y = this.player.body.y + this.player.body.height / 2;

          this.aimStartPosition.x = this.reticle.x;
          this.aimStartPosition.y = this.reticle.y;

          this.pointerStartPosition.x = this.pointer.worldX;
          this.pointerStartPosition.y = this.pointer.worldY;

          this.reticle.visible = true;
          // for(var i = 0; i < this.aimLine.length; i++)
          // {
          //   this.aimLine[i].visible = true;
          // }

          // console.log(this.aimStartPosition.x, this.aimStartPosition.y);

          this.player.currentState = this.player.states.aiming;
        }
        break;

      case this.player.states.aiming:
        if(this.pointer.isDown)
        {
          // console.log(this.pointer.position);

          this.reticle.x = this.player.body.x + this.player.body.width / 2;
          this.reticle.y = this.player.body.y + this.player.body.height / 2;

          this.aimStartPosition.x = this.reticle.x;
          this.aimStartPosition.y = this.reticle.y;          

          this.aimHeading = {
            x: this.pointer.worldX - this.pointerStartPosition.x,
            y: (this.pointer.worldY - 350) - this.pointerStartPosition.y 
          };

          this.aimDistance = vec2magnitude(this.aimHeading);

          this.normalisedAimDistance = this.aimDistance / constants.worldSize.width;
          // console.log(this.normalisedAimDistance);

          // this.aimDirection = this.aimHeading / this.aimDistance; 

          // This is the normalized direction.
          this.aimDirection = vec2divide(this.aimHeading, this.aimDistance);

          this.throwDirection = this.aimDirection;

          // this.debugText.text = "x: " + Math.floor(this.aimHeading.x) + 
          //                       " y: " + Math.floor(this.aimHeading.y);

          // this.debugText2.text = "x: " + this.throwDirection.x + 
          //                       " y: " + this.throwDirection.y;

          this.simulateTrajectory(
            vec2multiply(this.throwDirection, 625 * this.normalisedAimDistance));
        }
        else
        {
          if(this.aimHeading.x == 0 && this.aimHeading.y == 0)
          {
            console.log("Cannot jump. throwDirection is zero");
            this.player.currentState = this.player.states.readyToJump;
            return;
          }

          this.reticle.visible = false;
          for(var i = 0; i < this.aimLine.length; i++)
          {
            // this.aimLine[i].visible = false;
            this.aimLine[i].y = -100;
          }

          this.player.jump(
            this.throwDirection.x * 1 * this.normalisedAimDistance, 
            this.throwDirection.y * -1 * this.normalisedAimDistance
          );
          this.player.currentState = this.player.states.jumping;

          this.playAudio('jump');
          // console.log("Pointer up");
        }
      break;

      case this.player.states.jumping:
        // console.log(this.player.body.velocity.y);

        if(this.player.body.blocked.down)
        {
          if(this.player.body.velocity.y < 0)
          {
            // console.log("Player is moving up. Cannot land");
            return;
          }

          // console.log("Player has landed");
          this.player.currentState = this.player.states.readyToJump;
        }
        break;
    }
  }

  simulateTrajectory(velocity)
  {
    // _lineRenderer.enabled = _registrySO.isDebugMode && _useLineRenderer;
    var linePoints = 2;
    var timeBetweenPoints = 0.01;
    var counter = 0;

    var positionCount = Math.ceil(linePoints / timeBetweenPoints) + 1;

    var startVelocity = vec2divide(velocity, this.player.body.mass);
    startVelocity = vec2multiply(startVelocity, this.normalisedAimDistance);

    // this.path.clear();
    this.path = new Phaser.Curves.Path(this.aimStartPosition.x, this.aimStartPosition.y);
      // _lineRenderer.SetPosition(i, startPosition);
    
    var nextAimPoint = .05;
    var aimInterval = .05;
    var aimIndex = 0;
    for (var time = 0; time < linePoints; time += timeBetweenPoints)
    {
      var point = vec2addvec2(this.aimStartPosition, vec2multiply(startVelocity, time));
      // console.log("1 ", time, point);

      // // TODO: Replace 500 with gravity
      point.y = this.aimStartPosition.y + startVelocity.y * 
                time + (625 / 2 * time * time);

      if(time >= nextAimPoint && aimIndex < this.aimLine.length)
      {
        this.aimLine[aimIndex].x = point.x;
        this.aimLine[aimIndex].y = point.y;
        nextAimPoint = nextAimPoint + aimInterval;
        aimIndex ++;
      }

      this.path.lineTo(point.x, point.y);
      counter ++;
    }
    // console.log(counter);
  }

  generateSpike()
  {
    var distance = constants.gridSize * 0.8;  
    var spikeStartX = distance / 2;
    this.lastSpikePosition = spikeStartX + (this.spikes.children.entries.length * distance);
    this.addSpike(this.lastSpikePosition, 412);
    // console.log("spawn tree [" + this.trees.length + "] at " + this.lastTreePosition + " distance " + distance);
  }

  addSpike(x, y)
  {
    var spike = this.add.sprite(x, y, 'spike').setDepth(10);
    this.spikes.add(spike);
  }

  generateTree(allowBanana)
  {
    var distance = this.minDistanceBetweenTrees;  
    var allowedGap = this.maxDistanceBetweenTrees - this.minDistanceBetweenTrees;
    var random = Math.round(Math.random() * allowedGap);
    // distance = distance + random;
    this.lastTreePosition = this.treeStartX + (this.trees.length * distance);
    this.addTree(this.lastTreePosition, 10, allowBanana);
    // console.log("spawn tree [" + this.trees.length + "] at " + this.lastTreePosition + " distance " + distance);
  }

  addTree(x, y, allowBanana)
  {
    var tree = new Tree(
      this, 
      this.player,
      constants.gridSize * x, 
      constants.gridSize * y,
      allowBanana
    );
    this.trees[this.trees.length] = tree;
  }

  addBranch(x, y, scaleX, scaleY)
  {
    var branch = this.add.sprite(
                      constants.gridSize * x, 
                      constants.gridSize * y, 
                      'brown'
                    )
                    .setScale(scaleX, scaleY);
    this.branches.add(branch);
  }

  addWorldBorders()
  {
    // die when hit the left side off the screen
    this.worldBorderLeft = this.physics.add.staticGroup();

    var sprite = this.add.sprite(0, constants.gridSize * 5, 'red');
    sprite.setScale(1, 10).setAlpha(0);
    this.worldBorderLeft.add(sprite);

    this.physics.add.collider(
      this.player,
      this.worldBorderLeft
    );

    if(this.isPracticeMode)
    {
      this.worldBorderRight = this.physics.add.staticGroup();

      var sprite = this.add.sprite(constants.worldSize.width, constants.gridSize * 5, 'red');
      sprite.setScale(1, 10).setAlpha(0);
      this.worldBorderRight.add(sprite);

      this.physics.add.collider(
        this.player,
        this.worldBorderRight
      );
    }
  }

  addUIText()
  {
    this.scoreText = this.add.bitmapText(
      constants.gridSize / 2,
      // constants.gridSize / 2,
      (constants.gridSize * (constants.worldSize.unitHeight - 1)) - constants.gridSize / 2,
      "arcade",
      "debug",
      40
    ).setScrollFactor(0).setDepth(100); 
  }

  addDebugText()
  {
    // this.debugText = this.add.bitmapText(
    //   0,
    //   10,
    //   "arcade",
    //   "debug",
    //   20
    // ).setScrollFactor(0).setDepth(100);

    // this.debugText2 = this.add.bitmapText(
    //   0,
    //   30,
    //   "arcade",
    //   "debug 2",
    //   20
    // ).setScrollFactor(0).setDepth(100);

    // this.playerStateText = this.add.bitmapText(
    //   20,
    //   20,
    //   "arcade",
    //   this.player.currentState,
    //   20
    // ).setDepth(100);
  }

  loadAudios() {
    this.audios = {
      collect: this.sound.add("collect"),
      die: this.sound.add("die"),      
      jump: this.sound.add("jump"),
    }
  };

  playAudio(key) {
    if(!this.registry.get(constants.variableNames.soundEnabled)) return;
    // console.log("Play ", key);

    this.audios[key].play();
  }
}
