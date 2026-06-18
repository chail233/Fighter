// EquipPage - 装备管理页面 UI
// 职责：构建装备槽 + 背包的显示和交互
// 不应：修改游戏数据

import gameState, { EQUIPMENT_SLOTS } from '../GameState.js';
import gameManager from '../GameManager.js';
import { MenuSlot } from './MenuSlot.js';
import { Tooltip } from './Tooltip.js';

export class EquipPage {
    constructor(scene, container) {
        this.scene = scene;
        this.container = container;
        this.tooltip = new Tooltip(scene);

        const title = scene.add.text(640, 30, '装备管理', {
            fontSize: '28px', fontFamily: 'Arial', color: '#ffffff',
        }).setOrigin(0.5);
        container.add(title);

        const equipLabel = scene.add.text(640, 80, '已装备', {
            fontSize: '16px', fontFamily: 'Arial', color: '#aaaaaa',
        }).setOrigin(0.5);
        container.add(equipLabel);

        this.equipSlots = [];
        const slotSize = 70;
        const gap = 10;
        const totalWidth = EQUIPMENT_SLOTS * slotSize + (EQUIPMENT_SLOTS - 1) * gap;
        const startX = (1280 - totalWidth) / 2;

        for (let i = 0; i < EQUIPMENT_SLOTS; i++) {
            const x = startX + i * (slotSize + gap);
            const slot = new MenuSlot(scene, x, 110, slotSize, (idx) => {
                gameManager.handleEquipSlotClick(idx);
                this.refresh();
            }, i, container, this.tooltip);
            this.equipSlots.push(slot);
        }

        const backpackLabel = scene.add.text(640, 210, '背包', {
            fontSize: '16px', fontFamily: 'Arial', color: '#aaaaaa',
        }).setOrigin(0.5);
        container.add(backpackLabel);

        this.backpackSlots = [];
        this.refresh();

        const tip = scene.add.text(640, 660, '← 点击屏幕边缘切换页面 | 点击装备可交换位置', {
            fontSize: '14px', fontFamily: 'Arial', color: '#666666',
        }).setOrigin(0.5);
        container.add(tip);
    }

    refresh() {
        this.tooltip.hide();
        for (let i = 0; i < this.equipSlots.length; i++) {
            const eq = i < gameState.inventory.equipment.length ? gameState.inventory.equipment[i] : null;
            this.equipSlots[i].setEquipment(eq);
        }

        for (const slot of this.backpackSlots) {
            slot.destroy();
        }
        this.backpackSlots = [];

        const slotSize = 60;
        const gap = 8;
        const count = Math.min(gameState.inventory.items.length, 10);
        if (count === 0) return;

        const totalWidth = count * slotSize + (count - 1) * gap;
        const startX = (1280 - totalWidth) / 2;

        for (let i = 0; i < count; i++) {
            const x = startX + i * (slotSize + gap);
            const slot = new MenuSlot(this.scene, x, 240, slotSize, (idx) => {
                gameManager.handleBackpackClick(idx);
                this.refresh();
            }, i, this.container, this.tooltip);
            slot.setEquipment(gameState.inventory.items[i]);
            this.backpackSlots.push(slot);
        }
    }
}