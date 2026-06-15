// EquipmentSlot - 装备槽组件
// 职责：显示装备图标、CD 进度、就绪提示
// 不应：修改装备状态

export class EquipmentSlot {
    /**
     * @param {Phaser.Scene} scene - 所属场景
     * @param {number} x - 左上角 x
     * @param {number} y - 左上角 y
     * @param {number} size - 格子大小（正方形）
     */
    constructor(scene, x, y, size = 60) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.size = size;

        this.equipment = null;

        // 背景
        this.bg = scene.add.graphics();
        this.bg.fillStyle(0x222222, 0.8);
        this.bg.fillRoundedRect(x, y, size, size, 6);
        this.bg.lineStyle(1, 0x555555, 0.6);
        this.bg.strokeRoundedRect(x, y, size, size, 6);

        // CD 遮罩（灰色半透明覆盖）
        this.cdOverlay = scene.add.graphics();
        this.cdOverlay.setVisible(false);

        // 装备名称（CD 时显示名字，就绪时突出）
        this.label = scene.add.text(x + size / 2, y + size / 2, '空', {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#666666',
        }).setOrigin(0.5);

        // 就绪发光效果
        this.glow = scene.add.graphics();
        this.glow.setVisible(false);
    }

    /**
     * 设置该槽位的装备
     * @param {Equipment|null} equipment
     */
    setEquipment(equipment) {
        this.equipment = equipment;
        if (equipment) {
            this.label.setText(equipment.name);
            this.label.setColor('#ffffff');
        } else {
            this.label.setText('空');
            this.label.setColor('#666666');
        }
    }

    /**
     * 每帧更新 CD 显示
     */
    update() {
        if (!this.equipment || !this.equipment.cooldown) {
            this.cdOverlay.setVisible(false);
            this.glow.setVisible(false);
            return;
        }

        const progress = this.equipment.cooldownProgress;

        if (this.equipment.isReady) {
            // 就绪：显示发光边框
            this.cdOverlay.setVisible(false);
            this.glow.setVisible(true);
            this.glow.clear();
            this.glow.lineStyle(2, 0xffdd44, 0.8);
            this.glow.strokeRoundedRect(this.x - 1, this.y - 1, this.size + 2, this.size + 2, 7);
            this.label.setColor('#ffdd44');
        } else {
            // CD 中：从上到下的遮罩
            this.glow.setVisible(false);
            this.cdOverlay.setVisible(true);
            this.cdOverlay.clear();
            const overlayHeight = this.size * (1 - progress);
            this.cdOverlay.fillStyle(0x000000, 0.5);
            this.cdOverlay.fillRoundedRect(
                this.x, this.y + this.size - overlayHeight,
                this.size, overlayHeight,
                { tl: 0, tr: 0, bl: 6, br: 6 }
            );
            this.label.setColor('#aaaaaa');
        }
    }

    destroy() {
        this.bg.destroy();
        this.cdOverlay.destroy();
        this.label.destroy();
        this.glow.destroy();
    }
}