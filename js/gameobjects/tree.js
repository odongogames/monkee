export class Tree extends Phaser.GameObjects.Container {
	constructor(scene, player, x, y) {
		super(scene, x, y);
		// this.setAlpha(0);
		this.x = x;
		this.y = y;
		this.scene = scene;
		// this.width = constants.gridSize;
		// this.height = constants.gridSize;

		scene.add.existing(this);
		// scene.physics.add.existing(this);
		// this.body.immovable = true;

		this.addTrunk();
		// this.branches = this.scene.add.group();
		// this.branches = [];
		// this.addBranch(7, 7);
		// this.addBranch(0, 0);

    // this.scene.physics.add.collider(player, this.branches);

		// this.add(this.branches);
		// console.log(this.branches);
	}

	updatePosition()
	{
		// this.x += 0.1;
	}

	addTrunk()
	{
		this.trunk = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'darkbrown')
													.setScale(1, 8)
													.setOrigin(0.5, 1);

    this.add(this.trunk);
	}

	// addBranch(x, y)
	// {
	// 	var branch = this.scene.add.sprite(
	// 					constants.gridSize * x, 
	// 					constants.gridSize * y, 
	// 					'brown'
	// 				)
	// 				.setScale(4, .2);

	// 	// this.add(branch);
	// 	// this.branches[this.branches.length] = branch;
	// 	// console.log(this.branches);
	//     this.scene.branches.add(branch);
	// }

}