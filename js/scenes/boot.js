/// <reference path="../../types/phaser.d.ts" />

export class Boot extends Phaser.Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        // this.load.image('background', 'assets/bg.png');
    }

    create ()
    {
        this.registry.set(constants.variableNames.soundEnabled, true);
        this.registry.set(constants.variableNames.scoreToWin, constants.variables.scoreToWin);
        
        this.scene.start('Preloader');
    }
}
