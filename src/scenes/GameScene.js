export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        this.add.text(400, 300, 'Fighter', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff',
        }).setOrigin(0.5);

        this.add.text(400, 360, 'Phaser 3 格斗游戏', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#888888',
        }).setOrigin(0.5);
    }
}