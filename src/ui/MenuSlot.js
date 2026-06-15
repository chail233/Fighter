// MenuSlot - 菜单中的装备槽组件
// 职责：显示一个可点击的格子（装备/背包），展示装备名或"空"
// 不应：包含业务逻辑

export class MenuSlot {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x - 左上角 x
     * @param {number} y - 左上角 y
     * @param {number} size - 边长
     * @param {(index: number) => void} onClick - 点击回调
     * @param {number} [index] - 槽位索引
     * @param {Phaser.GameObjects.Container} [container] - 可选，添加到指定容器
     */
    constructor(scene, x, y, size, onClick, index = 0, container) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.size = size;
        this.index = index;

        const add = (obj) => { if (container) container.add(obj); };

        // 背景
        this.bg = scene.add.graphics();
        add(this.bg);
        this.bg.fillStyle(0x222244, 0.8);
        this.bg.fillRoundedRect(x, y, size, size, 8);
        this.bg.lineStyle(2, 0x444488, 0.6);
        this.bg.strokeRoundedRect(x, y, size, size, 8);

        // 标签
        this.label = scene.add.text(x + size / 2, y + size / 2, '空', {
            fontSize: '11px', fontFamily: 'Arial', color: '#666666',
        }).setOrigin(0.5);
        add(this.label);

        // 点击区域
        this.hitArea = scene.add.rectangle(x + size / 2, y + size / 2, size, size)
            .setInteractive({ useHandCursor: true });
        add(this.hitArea);
        this.hitArea.setAlpha(0.001);
        this.hitArea.on('pointerdown', () => onClick(this.index));

        this.equipment = null;
    }

    setEquipment(eq) {
        this.equipment = eq;
        if (eq) {
            this.label.setText(eq.name);
            this.label.setColor('#ffffff');
        } else {
            this.label.setText('空');
            this.label.setColor('#666666');
        }
    }

    destroy() {
        this.bg.destroy();
        this.label.destroy();
        this.hitArea.destroy();
    }
}