# MONKEE

Monkee is a platformer game developed using the Phaser 3 game engine. Players control a monkey that jumps from tree to tree and collects bananas. The game is a side-scroller that goes from left to right. This game was made for the itch.io 20 second game jam (add link here). 


## Game Modes

**Normal** 

In the normal game mode the player has 20 seconds to jump through the forest from branch to branch and collect bananas. Bananas appear randomly on tree branches and they can be collected by touching them. 

The floor is covered with spikes and touching these will return the player to the last branch they were standing on. At the end of 20 seconds the player is given their score.

**Practice**

In practice mode the player is placed in a static environment that is not side-scrolling. This 'room' contains a couple of trees that the player can jump on to practice their aiming and jumping. A single banana is present which spawns to a random location whenever the player touches it. There are no spikes on the floor so that the player can safely practice their movement and jumps. 

In-game instructions can be accessed by pressing a button in the lower-rignt of the screen in practice mode.


## Known Issues

**Aiming**

The monkey's aiming is not 100% accurate. To verify this, set { debug: true } in the Arcade physics section of js/main.js. Then set this.drawPath = false in the constructor of the Game class in js/scenes/game.js. When aiming, you will see that there is a blue line coming from Monkee that represents it's calculated path. Upon jumping you will notice that Monkee's jump does not completely follow the blue line.

**Mouse Position**

Aiming works fine as long as the mouse is within the Phaser app window. If the mouse goes outside the bounds of the Phaser window the mouse position can no longer be updated and the aiming freezes.


## Asset Creation

**Game Art**
The game's art was design in Adobe Illustrator 2023. The game was designed using a grid with a gridline every 42 px and 10 subdivisions. The font used is Arcade Normal

**Sounds**
The game's sounds were made using the Vital synth plugin and FL Studio 21.


## Feature Wishlist

* Multiple Color Palettes 

* Multiplayer  


## Special Thanks

Thanks to Pello for the book Phaser by Example and Richard Davey for Phaser itself.