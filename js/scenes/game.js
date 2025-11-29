import { Player } from '../gameobjects/player.js';

export class Game extends Phaser.Scene {
  constructor() {
      super('Game');

  }

  create() {
    // this.add.image(400, 300, 'sky'); //.setOrigin(0,0);
    // this.add.image(400, 300, 'star');

    this.player = new Player(this, 400, 50); 
    // this.player.body.mass = 1;
    // console.log("playser mass", this.player.body.mass);


    // TODO: Die when touch ground
    this.platforms = this.physics.add.staticGroup();

    var sprite = this.add.sprite(400, 568, 'green');
    sprite.setScale(14, 1);
    this.platforms.add(sprite);


    this.physics.add.collider(this.player, this.platforms);


    // die when hit the left side off the screen
    this.worldBorderLeft = this.physics.add.staticGroup();

    var sprite = this.add.sprite(30,120, 'red');
    sprite.setScale(1, 14);
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
    this.worldBorderRight = this.physics.add.staticGroup();

    var sprite = this.add.sprite(770,120, 'green');
    sprite.setScale(1, 14);
    this.worldBorderRight.add(sprite);

    this.physics.add.overlap(
      this.player,
      this.worldBorderRight,
      this.playerHitWorldBorderRight,
      () => {
        return true;
      },
      this
    );

    // input
    this.pointer = this.input.activePointer;
    this.input.mouse.disableContextMenu();

    // console.log(this.pointer);
            // console.log(Math);


    this.cursors = this.input.keyboard.createCursorKeys();

    // aiming
    this.reticle = this.add.sprite(400, 568, 'reticle');
    this.aimStartPosition = { x: 0, y: 0 };
    // this.reticle.visible = false;


    this.player.readyToJump = true;
    this.player.currentState = this.player.states.readyToJump;

    this.drawLine();

    this.debugText = this.add.bitmapText(
      0,
      10,
      "arcade",
      "debug",
      20
    );

    this.debugText2 = this.add.bitmapText(
      0,
      30,
      "arcade",
      "debug 2",
      20
    );

    this.graphics = this.add.graphics();
    this.graphics.lineStyle(1, 0xffffff, 1); // for debug


    // this.stars = this.physics.add.group({
    //     key: 'star',
    //     repeat: 11,
    //     setXY: { x: 12, y: 0, stepX: 70 }
    // });

    // this.stars.children.iterate(child => 
    // {
    //     child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    // });

    // this.physics.add.collider(this.stars, this.platforms);

    // this.physics.add.overlap(this.player, this.stars, this.collectStars, null, this);

    // this.score = 0;
    // this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    // this.bombs = this.physics.add.group();

    // this.physics.add.collider(this.bombs, this.platforms);
    // this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
  }

  playerHitWorldBorderLeft(player, border) {
    if (!player.dead) {
      // this.playAudio("holeshout");
      // hole.setAlpha(1);
      // player.setAlpha(0);
      // this.cameras.main.shake(30);
      this.player.die();
      // player.death();
      // this.restartScene();
    }
  }

  playerHitWorldBorderRight(player, border) {
    if (!player.dead) {
      // this.playAudio("holeshout");
      // hole.setAlpha(1);
      // player.setAlpha(0);
      // this.cameras.main.shake(20);
      this.player.turn();
      // player.death();
      // this.restartScene();
    }
  }

  update() {
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

    switch(this.player.currentState)
    {
      case this.player.states.readyToJump:
        if(this.pointer.isDown)
        {
          // this.reticle.visible = true;
          // console.log(this.pointer.position);
          this.reticle.x = this.pointer.worldX;
          this.reticle.y = this.pointer.worldY;
                
          this.aimStartPosition.x = this.pointer.worldX;
          this.aimStartPosition.y = this.pointer.position.y;

          // console.log(this.aimStartPosition.x, this.aimStartPosition.y);

          this.player.currentState = this.player.states.aiming;
        }
        break;

      case this.player.states.aiming:
          if(this.pointer.isDown)
          {
            this.aimHeading = {
              x: this.aimStartPosition.x - this.pointer.worldX,
              y: this.aimStartPosition.y - this.pointer.worldY 
            };

            this.aimDistance = this.vec2magnitude(this.aimHeading.x, this.aimHeading.y);
            // console.log(this.aimDistance);
            // this.aimDirection = this.aimHeading / this.aimDistance; 

            // This is the normalized direction.
            this.aimDirection = this.vec2divide(this.aimHeading, this.aimDistance);

            this.throwDirection = this.aimDirection;

            this.debugText.text = "x: " + Math.floor(this.aimHeading.x) + 
                                  " y: " + Math.floor(this.aimHeading.y);

            this.debugText2.text = "x: " + this.throwDirection.x + 
                                  " y: " + this.throwDirection.y;

            this.simulateTrajectory(this.vec2multiply(this.throwDirection, 500));
          }
          else
          {
            this.player.jump(this.throwDirection.x * 1.2, this.throwDirection.y * -1.2);
            this.player.currentState = this.player.states.jumping;
            console.log("Pointer up");
          }
        break;

        // case this.player.states.jumping:
        //   if(this.player.body.velocity.y > 0)
        //   {
        //     if(this.player.body.blocked.down)
        //     {
        //       this.player.currentState = this.player.states.readyToJump;
        //     }
        //   }
        //   break;
    }
  }

  drawLine()
  {
    const start = Phaser.Math.Between(100, 600);
    this.path = new Phaser.Curves.Path(start, 0);
    this.path.lineTo(start, Phaser.Math.Between(20, 50));
    let max = 8;
    let h = 500 / max;
    for (let i = 0; i < max; i++) {
    if (i % 2 === 0) {
    this.path.lineTo(start, 50 + h * (i + 1));
    } else {
    this.path.lineTo(start + 300, 50 + h * (i + 1));
    }
    }
    this.path.lineTo(start, this.scene.height + 50);
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(1, 0xffffff, 1); // for debug
  }

  simulateTrajectory(velocity)
  {
    // _lineRenderer.enabled = _registrySO.isDebugMode && _useLineRenderer;
    var linePoints = 10;
    var timeBetweenPoints = 0.1;

    var positionCount = Math.ceil(linePoints / timeBetweenPoints) + 1;

    var startVelocity = this.vec2divide(velocity, this.player.body.mass);

    // this.path.clear();
    this.path = new Phaser.Curves.Path(this.aimStartPosition.x, this.aimStartPosition.y);
      // _lineRenderer.SetPosition(i, startPosition);

    for (var time = 0; time < linePoints; time += timeBetweenPoints)
    {
      var point = this.vec2addvec2(this.aimStartPosition, this.vec2multiply(startVelocity, time));
      // console.log("1 ", time, point);

      // // TODO: Replace 500 with gravity
      point.y = this.aimStartPosition.y + startVelocity.y * time + (360 / 2 * time * time);

      //     // _lineRenderer.SetPosition(i, point);
      this.path.lineTo(point.x, point.y);
      // console.log("2 ", time,  point);

      // // check if line has hit floor
      // if (hit.collider)
      // {
      //   _lineRenderer.SetPosition(i, hit.point);
      //   _lineRenderer.positionCount = i + 1;

      //   _landingPoint = hit.point;

      //   // does landing point fall outside court bounds?
      //   var landingPointX = Mathf.Abs(_landingPoint.x);

      //   if (landingPointX > (float)GameManager.BorderRightPosition)
      //   {
      //     var diff = landingPointX - (float)GameManager.BorderRightPosition;
      //     diff = Mathf.Clamp(diff, 0, (float)GameManager.BorderRightPosition / 2);
      //     landingPointX = (float)GameManager.BorderRightPosition - diff;
      //     landingPointX *= Mathf.Sign(_landingPoint.x);

      //     _landingPoint.x = landingPointX;
      //     _idealHitPoint.x = landingPointX;

      //     // ideal hit point
      //     // var idealHitPointX = Mathf.Abs(_idealHitPoint.x);

      //     // diff = idealHitPointX - (float)GameManager.BorderRightPosition;
      //     // diff = Mathf.Clamp(diff, 0, (float)GameManager.BorderRightPosition / 2);
      //     // idealHitPointX = (float)GameManager.BorderRightPosition - diff;
      //     // idealHitPointX *= Mathf.Sign(transform.position.x);

      //     // _idealHitPoint.x = idealHitPointX;
      //   }
      //   // exit for loop
      //   return;
      // }
    }
  }

  // The length of the vector is square root of (x*x+y*y).
  vec2magnitude (a, b)
  {
    return Math.sqrt((a * a + b * b));
  }

  vec2divide (vec2, value)
  {
    return { x: vec2.x / value, y: vec2.y / value };
  }

  vec2multiply(vec2, value)
  {
    return { x: vec2.x * value, y: vec2.y * value };
  }

  vec2add (vec2,  value)
  {
    return { x: vec2.x + value, y: vec2.y + value };
  }

  vec2addvec2(a, b)
  {
    return { x: a.x + b.x, y: a.y + b.y };
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
