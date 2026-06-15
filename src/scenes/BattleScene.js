import gameState from '../GameState.js';

export class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleScene' });
    }

    create() {
        // 天空背景渐变
        const sky = this.add.graphics();
        sky.fillGradientStyle(0x1a1a4e, 0x1a1a4e, 0x4a7ab5, 0x4a7ab5, 1);
        sky.fillRect(0, 0, 1280, 720);

        // 云朵装饰
        for (let i = 0; i < 6; i++) {
            const x = Phaser.Math.Between(100, 1180);
            const y = Phaser.Math.Between(50, 400);
            const cloud = this.add.graphics();
            cloud.fillStyle(0xffffff, 0.15);
            cloud.fillEllipse(x, y, Phaser.Math.Between(80, 160), Phaser.Math.Between(30, 60));
            cloud.fillEllipse(x + 30, y - 10, Phaser.Math.Between(60, 100), Phaser.Math.Between(25, 40));
        }

        // 地面线
        const ground = this.add.graphics();
        ground.lineStyle(2, 0x2d5a27, 0.3);
        ground.beginPath();
        ground.moveTo(0, 620);
        for (let x = 0; x <= 1280; x += 40) {
            ground.lineTo(x, 620 + Phaser.Math.Between(-5, 10));
        }
        ground.strokePath();

        // 加载玩家飞机（左下）
        const playerSprite = this.add.image(200, 560, gameState.player.texture);
        playerSprite.setScale(0.3);

        // 加载敌人飞机（右上）
        const enemySprite = this.add.image(1080, 160, gameState.enemy.texture);
        enemySprite.setScale(0.3);
    }
}