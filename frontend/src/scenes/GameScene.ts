import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Arc;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super('GameScene');
  }

  preload() {
    // TODO: Load your tile textures here
    // this.load.image('grass', 'assets/grass.png');
    // this.load.image('dirt', 'assets/dirt.png');
  }

  create() {
    // Example: create a simple grid background
    const tileSize = 48;
    const gridWidth = 30;
    const gridHeight = 30;
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const color = (x + y) % 2 === 0 ? 0x88cc88 : 0xccb97e;
        this.add.rectangle(x * tileSize, y * tileSize, tileSize, tileSize, color)
          .setOrigin(0);
      }
    }

    // Create player (blue circle)
    this.player = this.add.circle(tileSize * gridWidth / 2, tileSize * gridHeight / 2, tileSize / 2.5, 0x3366ff);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1.5);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addKeys('W,A,S,D');
  }

  update() {
    const speed = 4;
    let vx = 0, vy = 0;
    if (this.cursors.left?.isDown || this.input.keyboard.addKey('A').isDown) vx = -speed;
    if (this.cursors.right?.isDown || this.input.keyboard.addKey('D').isDown) vx = speed;
    if (this.cursors.up?.isDown || this.input.keyboard.addKey('W').isDown) vy = -speed;
    if (this.cursors.down?.isDown || this.input.keyboard.addKey('S').isDown) vy = speed;
    this.player.x += vx;
    this.player.y += vy;
  }
} 