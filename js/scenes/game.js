import { Player } from '../gameobjects/player.js';
import { Tree } from '../gameobjects/tree.js';
import { WorldGrid } from '../gameobjects/worldgrid.js';

export class Game extends Phaser.Scene {
  constructor() {
      super('Game');

  }

  create() {    
    console.log("World size: ", constants.worldSize);
    // console.log(Math);

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

    this.trees = [];

    this.addTree(2.5, 10);
    // this.addBranch(2.5, 4, 2, 0.2);
    this.addBranch(2.5, 7, 4, 0.2);

    this.addTree(9.5, 10);
    // this.addBranch(10.5, 3, 2, 0.2);
    this.addBranch(8.5, 5, 3, 0.2);
    this.addBranch(10.5, 8, 3, 0.2);

    // TODO: Die when touch ground
    this.platforms = this.physics.add.staticGroup();

    for(var i = 0; i < 10; i++)
    {
      var sprite = this.add.sprite(
        constants.worldSize.width / 2 + (constants.worldSize.width * i), 
        constants.gridSize * 11, 
        'green'
      );
      sprite.setScale(16, 2);
      this.platforms.add(sprite);
    }

    this.physics.add.collider(this.player, this.platforms);

    // input
    this.pointer = this.input.activePointer;
    this.input.mouse.disableContextMenu();

    this.cursors = this.input.keyboard.createCursorKeys();

    // aiming
    this.reticle = this.add.sprite(
      constants.gridSize * constants.worldSize.unitWidth / 2, 
      constants.gridSize * (constants.worldSize.unitHeight - 1), 
      'reticle'
    );
    this.reticle.setDepth(this.player.depth + 1);
    this.aimStartPosition = { x: 0, y: 0 };
    // this.reticle.visible = false;

    this.addWorldBorders();

    this.worldGrid = new WorldGrid(this, 0, 0, 10, 0.25);

    this.addDebugText();

    this.graphics = this.add.graphics();
    this.graphics.lineStyle(1, 0xffffff, 1); // for debug

    this.normalisedAimDistance = 0;

    this.cameras.main.startFollow(this.player, true, 0.05, 0.05, -200, 240);
  }

  addWorldBorders()
  {

    // die when hit the left side off the screen
    this.worldBorderLeft = this.physics.add.staticGroup();

    var sprite = this.add.sprite(0, constants.gridSize * 5, 'red');
    sprite.setScale(1, 10);
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


    // bounce when hit right side off screen
    // this.worldBorderRight = this.physics.add.staticGroup();

    // var sprite = this.add.sprite(
    //   constants.gridSize * constants.worldSize.unitWidth,
    //   constants.gridSize * 5, 
    // 'green');

    // sprite.setScale(1, 10);
    // this.worldBorderRight.add(sprite);

    // this.physics.add.overlap(
    //   this.player,
    //   this.worldBorderRight,
    //   this.playerHitWorldBorderRight,
    //   () => {
    //     return true;
    //   },
    //   this
    // );
  }

  addDebugText()
  {
    this.debugText = this.add.bitmapText(
      0,
      10,
      "arcade",
      "debug",
      20
    ).setScrollFactor(0);

    this.debugText2 = this.add.bitmapText(
      0,
      30,
      "arcade",
      "debug 2",
      20
    ).setScrollFactor(0);

    this.playerStateText = this.add.bitmapText(
      20,
      20,
      "arcade",
      this.player.currentState,
      20
    );
  }

  playerHitWorldBorderLeft(player, border) {
    if (!player.isDead()) {
      // this.playAudio("holeshout");
      // hole.setAlpha(1);
      // player.setAlpha(0);
      // this.cameras.main.shake(30);
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

  update() {
    // this.cameras.main.x += -0.5;
    // this.cameras.main.x = constants.worldSize.width / 3 - this.player.body.x ;

    if (this.path) 
    {
      this.graphics.clear();
      this.path.draw(this.graphics);
    }

    if(this.cursors.left.isDown) {
        this.player.moveLeft();
    }
    else if (this.cursors.right.isDown) {
        this.player.moveRight();
    }
    else {
        this.player.idle();
    }

    if (this.cursors.up.isDown) {
        this.player.jump();
    }

    // this.playerStateText.text = this.player.currentState;
    // this.playerStateText.text = this.player.body.blocked.down;
    // this.playerStateText.text = this.roundToTwoDecimalPlaces(this.normalisedAimDistance);
    this.playerStateText.text = this.roundToTwoDecimalPlaces(this.player.body.x);
    this.playerStateText.setPosition(
      this.player.body.position.x - 15, 
      this.player.body.position.y - 30
    );

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

            this.aimDistance = this.vec2magnitude(this.aimHeading.x, this.aimHeading.y);

            this.normalisedAimDistance = this.aimDistance / constants.worldSize.width;
            // console.log(this.normalisedAimDistance);

            // this.aimDirection = this.aimHeading / this.aimDistance; 

            // This is the normalized direction.
            this.aimDirection = this.vec2divide(this.aimHeading, this.aimDistance);

            this.throwDirection = this.aimDirection;

            this.debugText.text = "x: " + Math.floor(this.aimHeading.x) + 
                                  " y: " + Math.floor(this.aimHeading.y);

            this.debugText2.text = "x: " + this.throwDirection.x + 
                                  " y: " + this.throwDirection.y;

            this.simulateTrajectory(
              this.vec2multiply(this.throwDirection, 625 * this.normalisedAimDistance));
          }
          else
          {
            if(this.aimHeading.x == 0 && this.aimHeading.y == 0)
            {
              console.log("Cannot jump. throwDirection is zero");
              this.player.currentState = this.player.states.readyToJump;
              return;
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
    var linePoints = 10;
    var timeBetweenPoints = 0.1;

    var positionCount = Math.ceil(linePoints / timeBetweenPoints) + 1;

    var startVelocity = this.vec2divide(velocity, this.player.body.mass);
    startVelocity = this.vec2multiply(startVelocity, this.normalisedAimDistance);

    // this.path.clear();
    this.path = new Phaser.Curves.Path(this.aimStartPosition.x, this.aimStartPosition.y);
      // _lineRenderer.SetPosition(i, startPosition);

    for (var time = 0; time < linePoints; time += timeBetweenPoints)
    {
      var point = this.vec2addvec2(this.aimStartPosition, this.vec2multiply(startVelocity, time));
      // console.log("1 ", time, point);

      // // TODO: Replace 500 with gravity
      point.y = this.aimStartPosition.y + startVelocity.y * 
                time + (625 / 2 * time * time);

      this.path.lineTo(point.x, point.y);
    }
  }

  collectStars(player, star)
  {
    // star.disableBody(true, true);

    // this.score += 10;
    // this.scoreText.setText('Score: ' + this.score);

    // if(this.stars.countActive(true) % 2 === 0)
    // {
    //     this.releaseBomb();
    // }

    // if(this.stars.countActive(true) === 0)
    // {
    //     this.stars.children.iterate(function(child)
    //     {
    //         child.enableBody(true, child.x, 0, true, true);
    //     });
    // }
  }

  releaseBomb()
  {
    // var x = (this.player.x < 400 ) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    // var bomb = this.bombs.create(x, 17, 'bomb');
    // bomb.setBounce(1);
    // bomb.setCollideWorldBounds(true);
    // bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  }

  hitBomb(player, bomb)
  {
    // this.physics.pause();

    // player.setTint(0xff0000);

    // player.anims.play('turn');

    // this.time.delayedCall(2000, () => 
    // {
    //     this.scene.start('GameOver');
    // });
  }
}
