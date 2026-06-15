import { GameScene } from './scenes/GameScene.js';
import { BootScene } from './scenes/BootScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: document.body,
    backgroundColor: '#1a1a2e',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    scene: [BootScene, GameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};

const game = new Phaser.Game(config);