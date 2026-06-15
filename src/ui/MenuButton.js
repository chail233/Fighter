// MenuButton - 菜单按钮组件
// 职责：显示一个可点击的按钮，带悬停高亮效果
// 不应：包含业务逻辑

export class MenuButton {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x - 中心 x
     * @param {number} y - 中心 y
     * @param {number} w - 宽度
     * @param {number} h - 高度
     * @param {string} text - 按钮文字
     * @param {() => void} onClick - 点击回调
     * @param {object} [opts]
     * @param {number} [opts.color] - 按钮颜色 0x334488
     * @param {number} [opts.hoverColor] - 悬停颜色 0x4466aa
     * @param {string} [opts.textColor] - 文字颜色 '#ffffff'
     * @param {Phaser.GameObjects.Container} [container] - 可选，添加到指定容器
     */
    constructor(scene, x, y, w, h, text, onClick, opts = {}, container) {
        const color = opts.color || 0x334488;
        const hoverColor = opts.hoverColor || 0x4466aa;
        const textColor = opts.textColor || '#ffffff';

        const add = (obj) => { if (container) container.add(obj); };

        this.bg = scene.add.graphics();
        add(this.bg);
        this.bg.fillStyle(color, 1);
        this.bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 8);

        this.label = scene.add.text(x, y, text, {
            fontSize: '18px', fontFamily: 'Arial', color: textColor,
        }).setOrigin(0.5);
        add(this.label);

        this.hitArea = scene.add.rectangle(x, y, w, h).setInteractive({ useHandCursor: true });
        add(this.hitArea);
        this.hitArea.setAlpha(0.001);
        this.hitArea.on('pointerdown', onClick);
        this.hitArea.on('pointerover', () => {
            this.bg.clear();
            this.bg.fillStyle(hoverColor, 1);
            this.bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 8);
        });
        this.hitArea.on('pointerout', () => {
            this.bg.clear();
            this.bg.fillStyle(color, 1);
            this.bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 8);
        });
    }

    destroy() {
        this.bg.destroy();
        this.label.destroy();
        this.hitArea.destroy();
    }
}