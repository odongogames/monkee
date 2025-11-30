export class Tree extends Phaser.GameObjects.Container {
	constructor(scene, player, x, y) {
		super(scene, x, y);
		// this.setAlpha(0);
		this.x = x;
		this.y = y;
		this.scene = scene;

		scene.add.existing(this);

		this.addTrunk();
		
    if(Math.random(0, 1) > 0.25)
    {
	    this.addOneBranch();
    }
    else
    {
	    this.addTwoBranches();
    }
	}

	addTrunk()
	{
		this.trunk = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'darkbrown')
													.setScale(1, 8)
													.setOrigin(0.5, 1);

    this.add(this.trunk);
	}

	addOneBranch()
	{
		var width = 2 + Math.round(Math.random() * 2);
		var x = Math.round(Math.random() * width) / 4;
		if(Math.random() > 0.5)
		{
			x = -x;
		}
		var y = 5 + Math.round(Math.random() * 4);
    this.addBranch(x, y, width, 0.2);
	}

	addTwoBranches()
	{
		// branch one
		var width = 2 + Math.round(Math.random() * 2);
		var x = Math.round(Math.random() * width) / 4;
		if(Math.random() > 0.5)
		{
			x = -x;
		}
		var y = 3 + Math.round(Math.random() * 3);
    this.addBranch(x, y, width, 0.2);

    // branch two
    width = 2 + Math.round(Math.random() * 2);
		x = Math.round(Math.random() * width) / 4;
		if(Math.random() > 0.5)
		{
			x = -x;
		}
		y = 7 + Math.round(Math.random() * 3);
    this.addBranch(x, y, width, 0.2);	
	}

  addBranch(x, y, scaleX, scaleY)
  {
    var branch = this.scene.add.sprite(
                      constants.gridSize * x + this.x, 
                      constants.gridSize * y, 
                      'brown'
                    )
                    .setScale(scaleX, scaleY);
    this.scene.branches.add(branch);
  }
}