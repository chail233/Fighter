import gameManager from '../GameManager.js';

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        this.load.image('Ki-61', 'assets/img/Fighters/Ki-61.png');
        this.load.image('N1K-J', 'assets/img/Fighters/N1K-J.png');
        for (let i = 0; i <= 4; i++) {
            this.load.audio(`Battle${i}`, `assets/music/Battle${i}.ogg`);
        }
        this.load.audio('Menu1', 'assets/music/Menu1.ogg');
    }

    create() {
        gameManager.initNewGame();
        this.scene.start('MenuScene');
    }
}