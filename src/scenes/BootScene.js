import gameState from '../GameState.js';
import { createEquipment } from '../data/equipmentConfig.js';

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        this.load.image('Ki-61', 'assets/img/Fighters/Ki-61.png');
        this.load.image('N1K-J', 'assets/img/Fighters/N1K-J.png');
    }

    create() {
        // 给双方各配一把初始机枪
        const playerGun = createEquipment('gun');
        const enemyGun = createEquipment('gun');
        gameState.inventory.equipment.push(playerGun);
        gameState.enemy.equipment.push(enemyGun);

        // 初始金币用于测试商店
        gameState.player.gold = 100;

        this.scene.start('MenuScene');
    }
}