export class Branches extends Phaser.GameObjects.Container {
	constructor(
    scene,
    player,
    x,
    y
  )
  {
    super(scene, x, y);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.immovable = true;
    this.body.pushable = false;
    // this.body.static = true;
    this.body.setAllowGravity(false);
    console.log(this.body);
    // this.scene.events.on("update", this.update, this);

    this.addBranch(2.5, 7, 4, 0.2);
  }

  addBranch(x, y, scaleX, scaleY)
  {
    // var branch = this.add.sprite(
    //                   constants.gridSize * x, 
    //                   constants.gridSize * y, 
    //                   'brown'
    //                 )
    //                 .setScale(scaleX, scaleY);
		var branch = new Phaser.GameObjects.Sprite(this.scene, 100, 100, 'brown');

    this.add(branch);
    // this.physics.add.existing(branch);
    // branch.body.setAllowGravity(false);
    // this.branches.add(branch);
    // this.worldObjects[this.worldObjects.length] = branch;
  }
}