export class Player extends Phaser.Physics.Arcade.Sprite
{
  constructor(scene, x, y)
  {
    super(scene, x, y, 'monkey');

    this.setDepth(1);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setBounce(0);
    // this.setCollideWorldBounds(true);
    // this.initAnimations();


    // states  
    this.states = {
        idle:           0,
        readyToJump:    1,
        aiming:         2,
        jumping:        3,
        dead:           100
    }

    this.currentState = this.states.readyToJump;

    this.cursors = scene.input.keyboard.createCursorKeys();

    this.A = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );
    this.D = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.D
    );
  }

  update()
  {
    if(this.body.y < 0 && this.body.velocity.y < 0)
    {
      this.body.velocity.y = -this.body.velocity.y;
    }

    if(this.cursors.left.isDown || this.A.isDown) {
        this.moveLeft();
    }
    else if (this.cursors.right.isDown || this.D.isDown) {
        this.moveRight();
    }
    else {
        this.idle();
    }
  }

  isDead()
  {
    return this.currentState == this.states.dead;
  }

  moveLeft()
  {
    if(this.isDead()) return;

    if(this.body.blocked.down)
        this.setVelocityX(-200);

    // this.anims.play('left', true);
  }

  moveRight()
  {
    if(this.isDead()) return;

    if(this.body.blocked.down)
        this.setVelocityX(200);


    // this.anims.play('right', true);
  }

  idle()
  {
    if(this.body.blocked.down)
        this.setVelocityX(0);

    // this.anims.play('turn');
  }

  jump()
  {
    if(this.isDead()) return;

    if(this.body.blocked.down)
    {
        this.setVelocityY(-500);
    }
  }

  jump(x, y)
  {
    if(this.isDead()) return;

    if(this.body.blocked.down)
    {
        this.setVelocityX(500 * x);
        this.setVelocityY(-500 * y);
    }
  }

  turn()
  {
    if(this.isDead()) return;

    this.setVelocityX(-this.body.velocity.x);
    // console.log("turn monkey");
  }

  die()
  {
    this.currentState = this.states.dead;
    this.body.setAllowGravity(false);
    this.setVelocityX(0);
    this.setVelocityY(0);
    console.log("dead monkey");
  }
}