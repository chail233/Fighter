import gameState from '../GameState.js';
import gameManager from '../GameManager.js';
import { BattleHud } from '../ui/BattleHud.js';
import { CombatLog } from '../ui/CombatLog.js';

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

        // 玩家飞机（左下）
        const playerSprite = this.add.image(200, 560, gameState.player.texture);
        playerSprite.setScale(0.3);

        // 敌人飞机（右上）
        const enemySprite = this.add.image(1080, 160, gameState.enemy.texture);
        enemySprite.setScale(0.3);

        // 战斗 HUD
        this.hud = new BattleHud(this);
        this.hud.bindPlayer(gameState.player, gameState.inventory);
        this.hud.bindEnemy(gameState.enemy);

        // 战斗日志（左上角）
        this.combatLog = new CombatLog(this, 10, 90);
        gameManager.bindLog(this.combatLog);

        // 战斗是否已结束
        this._ended = false;
    }

    update(time, delta) {
        if (this._ended) return;

        gameManager.update(delta);
        this.hud.update(gameState.player, gameState.enemy);
        this.combatLog.update();

        // 检查敌人死亡 → 战斗胜利
        if (gameState.enemy.hp <= 0 && !this._ended) {
            this._ended = true;
            this._onVictory();
        }

        // 检查玩家死亡 → 战斗失败
        if (gameState.player.hp <= 0 && !this._ended) {
            this._ended = true;
            this._onDefeat();
        }
    }

    _onVictory() {
        // 发放奖励 + 推进节点
        const rewards = gameManager.collectRewards();
        const rewardStr = rewards.items.length > 0
            ? `获得 ${rewards.gold} G 和装备 ${rewards.items.join(', ')}`
            : `获得 ${rewards.gold} G`;

        gameManager.advanceNode();

        // 显示胜利文本 + 返回按钮
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.6);
        overlay.fillRect(0, 0, 1280, 720);

        const victoryText = this.add.text(640, 260, '🎉 胜利！', {
            fontSize: '40px', fontFamily: 'Arial', color: '#ffdd44', fontWeight: 'bold',
        }).setOrigin(0.5);

        const rewardLabel = this.add.text(640, 330, rewardStr, {
            fontSize: '20px', fontFamily: 'Arial', color: '#ffffff',
        }).setOrigin(0.5);

        const btn = this.add.text(640, 420, '[ 返回关卡 ]', {
            fontSize: '22px', fontFamily: 'Arial', color: '#88aaff',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setColor('#ffffff'));
        btn.on('pointerout', () => btn.setColor('#88aaff'));
        btn.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }

    _onDefeat() {
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.6);
        overlay.fillRect(0, 0, 1280, 720);

        const defeatText = this.add.text(640, 260, '💥 战败！', {
            fontSize: '40px', fontFamily: 'Arial', color: '#ff6644', fontWeight: 'bold',
        }).setOrigin(0.5);

        const tip = this.add.text(640, 330, '调整装备，再试一次', {
            fontSize: '20px', fontFamily: 'Arial', color: '#aaaaaa',
        }).setOrigin(0.5);

        const btn = this.add.text(640, 420, '[ 返回关卡 ]', {
            fontSize: '22px', fontFamily: 'Arial', color: '#88aaff',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setColor('#ffffff'));
        btn.on('pointerout', () => btn.setColor('#88aaff'));
        btn.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}
