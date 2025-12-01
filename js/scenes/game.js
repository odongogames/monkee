import { Player } from '../gameobjects/player.js';
import { Tree } from '../gameobjects/tree.js';
import { WorldGrid } from '../gameobjects/worldgrid.js';

export class Game extends Phaser.Scene {
  constructor() {
      super('Game');

      this.drawPath = false;
      this.score = 0;
  }

  create() {    
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
    this.player.currentState = this.player.states.readyToJump;

    this.branches = this.physics.add.staticGroup();
    this.physics.add.collider(this.player, this.branches);

    this.bananas = this.physics.add.staticGroup();
    // this.bananas.setAllowGravity(false);
    this.physics.add.overlap(this.player, this.bananas, this.collectBanana, null, this);

    this.trees = [];
    this.treeStartX =  2.5;
    this.minDistanceBetweenTrees = 6; 
    this.maxDistanceBetweenTrees = 9;
    this.lastTreePosition = 0;
    this.treeSpawnDistance = (constants.worldSize.unitWidth  / 2) * constants.gridSize; 
    for(var i = 0; i < 2; i++)
    {
        this.generateTree();  
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
    this.input.mouse.disableContextMenu();

    this.cursors = this.input.keyboard.createCursorKeys();

    this.A = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );
    this.D = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.D
    );

    // aiming
    this.reticle = this.add.sprite(
      constants.gridSize * constants.worldSize.unitWidth / 2, 
      constants.gridSize * (constants.worldSize.unitHeight - 1), 
      'reticle'
    );
    this.reticle.setDepth(this.player.depth + 1);
    this.aimStartPosition = { x: 0, y: 0 };

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
    for(var i = 0; i < 16; i++)
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

    this.cameras.main.startFollow(this.player, true, 0.05, 0.05, -100, 240);
  }

  collectBanana(player, banana)
  {
    // player.disableBody(true, true);
    banana.destroy();
    // banana.disableBody(true, true);

    this.score++;

    if(this.score - 1 < this.bananaIcons.length)
    {
      this.bananaIcons[this.score - 1].visible = true;
    }
    // this.scoreText.setText(this.score);
    // console.log("Collect banana [" + this.score + "]");
  }


  update() {
    // this.cameras.main.x += -0.5;
    // this.cameras.main.x = constants.worldSize.width / 3 - this.player.body.x ;
    if(this.player.body.x > (this.lastTreePosition * constants.gridSize) - this.treeSpawnDistance)
    {
      this.generateTree();
    }

    if(this.player.body.y < 0 && this.player.body.velocity.y < 0)
    {
      this.player.body.velocity.y = -this.player.body.velocity.y;
    }

    if (this.path && this.drawPath) 
    {
      this.graphics.clear();
      this.path.draw(this.graphics);
    }

    if(this.cursors.left.isDown || this.A.isDown) {
        this.player.moveLeft();
    }
    else if (this.cursors.right.isDown || this.D.isDown) {
        this.player.moveRight();
    }
    else {
        this.player.idle();
    }

    // this.playerStateText.text = this.player.currentState;
    // this.playerStateText.text = this.player.body.blocked.down;
    // this.playerStateText.text = this.roundToTwoDecimalPlaces(this.normalisedAimDistance);
    // this.playerStateText.text = roundToTwoDecimalPlaces(this.player.body.velocity.y);
    // this.playerStateText.setPosition(
    //   this.player.body.position.x - 15, 
    //   this.player.body.position.y - 30
    // );

    switch(this.player.currentState)
    {
      case this.player.states.readyToJump:
        if(this.pointer.isDown)
        {
          // this.reticle.visible = true;
          this.aimStartPosition.x = this.player.body.x + this.player.body.width / 2;
          this.aimStartPosition.y = this.player.body.y + this.player.body.height / 2;

          this.reticle.x = this.aimStartPosition.x;
          this.reticle.y = this.aimStartPosition.y;

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
          this.aimStartPosition.x = this.player.body.x + this.player.body.width / 2;
          this.aimStartPosition.y = this.player.body.y + this.player.body.height / 2;

          this.reticle.x = this.aimStartPosition.x;
          this.reticle.y = this.aimStartPosition.y;

          this.aimHeading = {
            x: this.pointer.worldX - this.aimStartPosition.x,
            y: (this.pointer.worldY - 400) - this.aimStartPosition.y 
          };

          this.aimDistance = vec2magnitude(this.aimHeading.x, this.aimHeading.y);

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
          // console.log("Pointer up");
        }
      break;

      case this.player.states.jumping:
        // console.log(this.player.body.velocity.y);

        if(this.player.body.blocked.down)
        {
          if(this.player.body.velocity.y < 0)
          {
            console.log("Player is moving up. Cannot land");
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

  generateTree()
  {
    var distance = this.minDistanceBetweenTrees;  
    var allowedGap = this.maxDistanceBetweenTrees - this.minDistanceBetweenTrees;
    var random = Math.round(Math.random() * allowedGap);
    // distance = distance + random;
    this.lastTreePosition = this.treeStartX + (this.trees.length * distance);
    this.addTree(this.lastTreePosition, 10);
    // console.log("spawn tree [" + this.trees.length + "] at " + this.lastTreePosition + " distance " + distance);
  }

  addWorldBorders()
  {
    // die when hit the left side off the screen
    this.worldBorderLeft = this.physics.add.staticGroup();

    var sprite = this.add.sprite(constants.gridSize / 2, constants.gridSize * 5, 'red');
    sprite.setScale(1, 10).setAlpha(0);
    this.worldBorderLeft.add(sprite);

    this.physics.add.overlap(
      this.player,
      this.worldBorderLeft,
      this.playerHitWorldBorderLeft,
      () => {
        return true;
      },
      this
    );
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

    this.playerStateText = this.add.bitmapText(
      20,
      20,
      "arcade",
      this.player.currentState,
      20
    ).setDepth(100);
  }

  playerHitWorldBorderLeft(player, border) {
    if (!player.isDead()) {
      // this.playAudio("holeshout");
      // hole.setAlpha(1);
      // player.setAlpha(0);
      // this.cameras.main.shake(30);
      if(player.body.velocity.x < 0)
        player.turn();
      // player.die();
      // this.restartScene();
    }
  }

  playerHitWorldBorderRight(player, border) {
    if (!player.isDead()) {
      // this.playAudio("holeshout");
      // hole.setAlpha(1);
      // player.setAlpha(0);
      // this.cameras.main.shake(20);
      player.turn();
      // player.death();
      // this.restartScene();
    }
  }

  addTree(x, y)
  {
    var tree = new Tree(
      this, 
      this.player,
      constants.gridSize * x, 
      constants.gridSize * y
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
}
