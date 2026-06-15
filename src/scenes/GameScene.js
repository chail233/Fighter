export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        this.add.text(640, 330, 'Fighter', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#888888',
        }).setOrigin(0.5);

        this.add.text(640, 380, '战斗机', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#888888',
        }).setOrigin(0.5);
    }
}