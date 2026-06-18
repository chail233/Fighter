// Tooltip - 悬浮提示框组件
// 职责：在鼠标位置显示装备详细信息
// 不应：修改游戏数据

import { EQUIPMENT_CATEGORIES } from '../data/equipmentConfig.js';

export class Tooltip {
    constructor(scene) {
        this.scene = scene;
        this.container = scene.add.container(0, 0).setDepth(1000).setVisible(false);

        this.bg = scene.add.graphics();
        this.container.add(this.bg);

        this.categoryText = scene.add.text(0, 0, '', {
            fontSize: '12px', fontFamily: 'Arial', color: '#ffffff',
        });
        this.container.add(this.categoryText);

        this.nameText = scene.add.text(0, 0, '', {
            fontSize: '16px', fontFamily: 'Arial', color: '#ffdd44',
        });
        this.container.add(this.nameText);

        this.descText = scene.add.text(0, 0, '', {
            fontSize: '13px', fontFamily: 'Arial', color: '#cccccc',
            wordWrap: { width: 500 },
        });
        this.container.add(this.descText);

        this.statsText = scene.add.text(0, 0, '', {
            fontSize: '12px', fontFamily: 'Arial', color: '#aaaaaa',
        });
        this.container.add(this.statsText);
    }

    show(equipment, x, y) {
        if (!equipment) {
            this.hide();
            return;
        }

        const pad = 14;
        const gap = 6;
        let cy = pad;

        // 类别标签
        const catKey = equipment.category || '';
        const cat = EQUIPMENT_CATEGORIES[catKey];
        if (cat) {
            this.categoryText.setText(`[${cat.name}]`);
            this.categoryText.setColor(cat.color);
            this.categoryText.setPosition(pad, cy);
            cy += 20;
        }

        this.nameText.setText(equipment.name || '');
        this.nameText.setPosition(pad, cy);
        cy += 26;

        this.descText.setText(equipment.description || '');
        this.descText.setPosition(pad, cy);
        cy += this.descText.height + gap;

        const stats = [];
        if (equipment.value) stats.push(`强度: ${equipment.value}`);
        if (equipment.cooldown) stats.push(`CD: ${equipment.cooldown}s`);
        this.statsText.setText(stats.join('  |  '));
        this.statsText.setPosition(pad, cy);

        if (stats.length > 0) cy += 22;

        // 根据文字实际宽度计算 tooltip 宽度
        const textW = Math.max(
            this.nameText.width,
            this.descText.width,
            this.statsText.width
        );
        const w = textW + pad * 2;
        const h = cy + pad;

        // 定位：优先显示在鼠标右侧，超出屏幕则显示在左侧
        const gapX = 18;
        let px;
        if (x + gapX + w <= 1280) {
            px = x + gapX;
        } else {
            px = x - gapX - w;
        }
        px = Math.max(5, Math.min(px, 1280 - w - 5));
        const py = Math.max(5, Math.min(y - 10, 720 - h - 5));

        this.container.setPosition(px, py);

        this.bg.clear();
        this.bg.fillStyle(0x111122, 0.95);
        this.bg.fillRoundedRect(0, 0, w, h, 8);
        this.bg.lineStyle(1, 0x444488, 0.8);
        this.bg.strokeRoundedRect(0, 0, w, h, 8);

        this.container.setVisible(true);
    }

    hide() {
        this.container.setVisible(false);
    }

    destroy() {
        this.container.destroy();
    }
}