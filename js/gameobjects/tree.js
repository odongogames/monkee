export class Tree extends Phaser.GameObjects.Container {
  constructor(scene, player, x, y, allowBanana) {
    super(scene, x, y);
    // this.setAlpha(0);
    this.x = x;
    this.y = y;
    this.allowBanana = allowBanana;
    this.scene = scene;

    scene.add.existing(this);

    this.branches = [];

    this.addTrunk();
    this.addTreeTop();
    
    if(Math.random(0, 1) < 0.5)
    {
      this.branches[this.branches.length] = this.addRandomBranch(2, 2, 5, 4, 0.85);
    }
    else
    {
      var random = Math.random();
      var branch = this.addRandomBranch(2, 2, 3, 2, random);
      this.branches[this.branches.length] = branch;

      random = this.hasBanana ? 0 : 1 - random;
      this.branches[this.branches.length] = this.addRandomBranch(2, 2, 7, 2, random);
    }
  }

  addTrunk()
  {
    this.trunk = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'darkbrown')
                          .setScale(1, 9)
                          .setOrigin(0.5, 1);

    this.add(this.trunk);
  }

  addTreeTop()
  {
    var spriteName = Math.random() > 0.5 ? "treetop-4" : "treetop-5";
    var y = -8 * constants.gridSize;
    var treetop = new Phaser.GameObjects.Sprite(this.scene, 0, y, spriteName)
                          .setOrigin(0.5, 1);

    this.add(treetop);
  }

  addRandomBranch(width, widthRandomness, y, yRandomness, bananaChance)
  {
    width = width + Math.round(Math.random() * widthRandomness);
    var x = Math.round(Math.random() * width / 4);
    if(Math.random() > 0.5)
    {
      x = -x;
    }
    y = y + Math.round(Math.random() * yRandomness);
    var branch = this.addBranch(x, y, width, 0.2);
    branch.hasBanana = false;

    if(Math.random() < bananaChance)
    {
      if(!this.allowBanana)
      {
        return branch;
      }
      
      if(this.scene.isPracticeMode && this.scene.hasBanana)
      {
        return branch;
      }

      this.addBanana(branch);
      this.scene.hasBanana = true;
    }

    return branch;
  }

  addBranch(x, y, scaleX, scaleY)
  {
    // console.log("scale x: " + scaleX);
    var spriteName = "branch-4";
    if(scaleX == 2)
      spriteName = "branch-2";
    else if(scaleX == 3)
      spriteName = "branch-3";

    var branch = this.scene.add.sprite(
                      constants.gridSize * x + this.x, 
                      constants.gridSize * y, 
                      spriteName
                    )
                    .setScale(1, 1);
    this.scene.branches.add(branch);

    return branch;
  }

  addBanana(branch)
  {
    var x = branch.x - (branch.scaleX / 2) * constants.gridSize;
    x += Math.random() * branch.scaleX * constants.gridSize;

    var banana = this.scene.add.sprite(
                      x, 
                      branch.y - constants.gridSize, 
                      'banana'
                    );
    // banana.setAllowGravity(false);
    this.scene.bananas.add(banana);

    return banana;
  }
}