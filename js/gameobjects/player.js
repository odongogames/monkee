export class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'monkey');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setBounce(0);
        // this.setCollideWorldBounds(true);
        // this.initAnimations();

        this.jumpStrength = 10;

        // states  
        this.readyToJump = false;
        this.dead = false;

        this.states = {
            idle:           0,
            readyToJump:    1,
            aiming:         2,
            jumping:        3,
            dead:           100
        }

        this.currentState = this.states.idle;
    }


    // initAnimations()
    // {
    //     this.anims.create({
    //         key: 'left',
    //         frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
    //         frameRate: 10,
    //         repeat: -1
    //     });

    //     this.anims.create({
    //         key: 'turn',
    //         frames: [ { key: 'dude', frame: 4 } ],
    //         frameRate: 1
    //     });

    //     this.anims.create({
    //         key: 'right',
    //         frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
    //         frameRate: 10,
    //         repeat: -1
    //     });
    // }

    moveLeft()
    {
        if(this.dead) return;

        if(this.body.blocked.down)
            this.setVelocityX(-200);

        // this.anims.play('left', true);
    }

    moveRight()
    {
        if(this.dead) return;

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
        if(this.dead) return;

        if(this.body.blocked.down)
        {
            this.setVelocityY(-500);
        }
    }

    jump(x, y)
    {
        if(this.dead) return;

        if(this.body.blocked.down)
        {
            this.setVelocityX(500 * x);
            this.setVelocityY(-500 * y);
        }
    }

    turn()
    {
        if(this.dead) return;

        this.setVelocityX(-this.body.velocity.x);
        console.log("turn monkey");
    }

    die()
    {
        this.currentState = this.states.dead;
        this.dead = true;
        this.body.setAllowGravity(false);
        this.setVelocityX(0);
        this.setVelocityY(0);
        this.readyToJump = false;
        console.log("dead monkey");
    }
}