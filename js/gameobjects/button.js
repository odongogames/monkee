export class Button extends Phaser.GameObjects.Container {
	constructor(scene,x,y, text, textSize, textColor, bgColor)
  {
    super(scene, x, y);
    this.x = x;
    this.y = y;
    this.scene = scene;
    this.scene.add.existing(this);

    this.text = text;
    this.textSize = textSize;
    this.textColor = textColor;
    this.bgColor = bgColor;

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

    this.addText();
  }

  addText()
  {
    this.textObject = this.scene.add
      .bitmapText(this.x, this.y, "arcade", this.text, this.textSize)
      .setOrigin(0.5, 0.5)
      .setTint(this.textColor)
      .setDepth(100);

    // console.log(this.textObject);

    this.leftIndicator.x -= this.textObject.displayWidth / 2 + 30;
    this.rightIndicator.x += this.textObject.displayWidth / 2 + 30;

    var scaleX = this.textObject.displayWidth / constants.gridSize;
    var scaleY = this.textObject.displayHeight / constants.gridSize;

    scaleY *= 1.2;
    scaleX *= 1.2;

    this.background = this.scene.add.sprite(
      this.x,
      this.y, 
      'darkbrown'
    ).setScale(scaleX, scaleY).setDepth(99);

    this.background.setInteractive();

    this.background.on("pointerover", () => {
      this.showIndicators();
    });

    this.background.on("pointerout", () => {
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
