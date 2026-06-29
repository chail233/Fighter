// ShieldBar - 防护值条组件
// 职责：显示当前防护值的进度条（防护值无上限，按当前值占固定宽度比例显示）
// 不应：修改防护值数据

export class ShieldBar {
    /**
     * @param {Phaser.Scene} scene - 所属场景
     * @param {number} x - 左上角 x
     * @param {number} y - 左上角 y
     * @param {number} width - 进度条宽度
     * @param {number} height - 进度条高度
     */
    constructor(scene, x, y, width, height) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.currentShield = 0;

        // 背景（深灰色）
        this.bg = scene.add.graphics();
        this.bg.fillStyle(0x222244, 0.8);
        this.bg.fillRoundedRect(x, y, width, height, 4);

        // 防护值填充（蓝色）
        this.fill = scene.add.graphics();
        this.drawFill(0);

        // 边框
        this.border = scene.add.graphics();
        this.border.lineStyle(2, 0x4488ff, 0.6);
        this.border.strokeRoundedRect(x, y, width, height, 4);

        // 文字
        this.text = scene.add.text(x + width / 2, y + height / 2, '防护 0', {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#88bbff',
            stroke: '#000044',
            strokeThickness: 2,
        }).setOrigin(0.5);
    }

    /**
     * 更新防护值条显示
     * @param {number} currentShield
     */
    update(currentShield) {
        this.currentShield = currentShield;

        // 防护值无上限，用当前值 / 100 作为显示比例（上限 1）
        const ratio = Math.min(1, currentShield / 100);
        this.drawFill(ratio);

        this.text.setText(`防护 ${Math.ceil(currentShield)}`);
    }

    drawFill(ratio) {
        this.fill.clear();
        if (ratio > 0) {
            const color = ratio > 0.5 ? 0x4488ff : ratio > 0.25 ? 0x6688cc : 0x4466aa;
            this.fill.fillStyle(color, 0.9);
            this.fill.fillRoundedRect(
                this.x + 2,
                this.y + 2,
                (this.width - 4) * ratio,
                this.height - 4,
                3
            );
        }
    }

    destroy() {
        this.bg.destroy();
        this.fill.destroy();
        this.border.destroy();
        this.text.destroy();
    }
}
