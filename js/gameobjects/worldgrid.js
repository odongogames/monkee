export class WorldGrid extends Phaser.GameObjects.Container {
	constructor(scene, x, y, numberOfGrids, alpha) {
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

		this.addGrid(numberOfGrids, alpha);
	}

	addGrid(number, alpha)
	{
    for (var i = 0; i < number; i++) 
    {
			var grid = new Phaser.GameObjects.Sprite(
														this.scene, 
														constants.worldSize.width / 2 + (constants.worldSize.width * i), 
														constants.worldSize.height / 2, 
														'grid')
														.setAlpha(alpha);

	    this.add(grid);
    }

	}
}