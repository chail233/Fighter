// HpBar - 血条组件
// 职责：显示当前/最大 HP 的进度条
// 不应：修改血量数据

export class HpBar {
    /**
     * @param {Phaser.Scene} scene - 所属场景
     * @param {number} x - 左上角 x
     * @param {number} y - 左上角 y
     * @param {number} width - 血条宽度
     * @param {number} height - 血条高度
     * @param {number} [maxHp=100] - 初始最大血量
     */
    constructor(scene, x, y, width, height, maxHp = 100) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.currentHp = maxHp;
        this.maxHp = maxHp;

        // 背景（灰色）
        this.bg = scene.add.graphics();
        this.bg.fillStyle(0x333333, 0.8);
        this.bg.fillRoundedRect(x, y, width, height, 4);

        // 血量填充（绿色）
        this.fill = scene.add.graphics();
        this.drawFill(1);

        // 边框
        this.border = scene.add.graphics();
        this.border.lineStyle(2, 0xffffff, 0.6);
        this.border.strokeRoundedRect(x, y, width, height, 4);

        // 文字
        this.text = scene.add.text(x + width / 2, y + height / 2, `${maxHp}/${maxHp}`, {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
        }).setOrigin(0.5);
    }

    /**
     * 更新血条显示
     * @param {number} currentHp
     * @param {number} maxHp
     */
    update(currentHp, maxHp) {
        this.currentHp = currentHp;
        this.maxHp = maxHp;

        const ratio = Math.max(0, currentHp / maxHp);
        this.drawFill(ratio);

        this.text.setText(`${Math.ceil(currentHp)}/${maxHp}`);
    }

    drawFill(ratio) {
        this.fill.clear();
        const color = ratio > 0.5 ? 0x44cc44 : ratio > 0.25 ? 0xccaa00 : 0xcc3333;
        this.fill.fillStyle(color, 0.9);
        this.fill.fillRoundedRect(
            this.x + 2,
            this.y + 2,
            (this.width - 4) * ratio,
            this.height - 4,
            3
        );
    }

    destroy() {
        this.bg.destroy();
        this.fill.destroy();
        this.border.destroy();
        this.text.destroy();
    }
}