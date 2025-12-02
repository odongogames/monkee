export class ImageButton extends Phaser.GameObjects.Container {
	constructor(scene,x,y, imageName)
  {
    super(scene, x, y);
    this.x = x;
    this.y = y;
    this.scene = scene;
    this.scene.add.existing(this);

    this.imageName = imageName;

    this.leftIndicator = this.scene.add.sprite(
      this.x,
      this.y, 
      'indicator'
    ).setScale(-1, 1).setDepth(99);

    this.rightIndicator = this.scene.add.sprite(
      this.x,
      this.y, 
      'indicator'
    ).setScale(1, 1).setDepth(99);

    this.hideIndicators();

    this.addImage();
  }

  addImage()
  {
    this.image =  this.scene.add.sprite(
      this.x, 
      this.y, 
      this.imageName
    ).setDepth(200).setScale(0.5, 0.5);

    this.leftIndicator.x -= this.image.displayWidth / 2 + 30;
    this.rightIndicator.x += this.image.displayWidth / 2 + 30;

    this.image.setInteractive();

    this.image.on("pointerover", () => {
      this.showIndicators();
    });

    this.image.on("pointerout", () => {
      this.hideIndicators();
    });
  }

  showIndicators()
  {
    // console.log("Show inidicators");

    this.leftIndicator.visible = true;
    this.rightIndicator.visible = true;
  }

  hideIndicators()
  {
    // console.log("HIde inidicators");

    this.leftIndicator.visible = false;
    this.rightIndicator.visible = false;
  }
}
