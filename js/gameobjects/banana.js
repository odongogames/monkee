export class Banana extends Phaser.Physics.Arcade.Sprite {
	constructor(scene,x,y)
  {
    super(scene, x, y, "banana");
    this.scene = scene;
    this.scene.add.existing(this);
  }
}