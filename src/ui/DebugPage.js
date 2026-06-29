// DebugPage - 调试页面 UI
// 职责：显示所有装备配置，点击即可获取装备
// 不应：在正式发布中启用

import gameState from '../GameState.js';
import gameManager from '../GameManager.js';
import { MenuSlot } from './MenuSlot.js';
import { Tooltip } from './Tooltip.js';
import { EQUIPMENT_CONFIGS, createEquipment } from '../data/equipmentConfig.js';

export class DebugPage {
    constructor(scene, container) {
        this.scene = scene;
        this.container = container;
        this.tooltip = new Tooltip(scene);
        this.slots = [];

        const title = scene.add.text(640, 30, '调试 - 获取装备', {
            fontSize: '28px', fontFamily: 'Arial', color: '#ff6666',
        }).setOrigin(0.5);
        container.add(title);

        const tip = scene.add.text(640, 70, '点击装备即可直接获取（自动装备到空槽位或放入背包）', {
            fontSize: '14px', fontFamily: 'Arial', color: '#888888',
        }).setOrigin(0.5);
        container.add(tip);

        this.refresh();
    }

    refresh() {
        this.tooltip.hide();

        // 清除旧槽位
        for (const slot of this.slots) {
            slot.destroy();
        }
        this.slots = [];

        const allConfigs = Object.values(EQUIPMENT_CONFIGS);
        const slotSize = 70;
        const gap = 12;
        const cols = 6;
        const totalRowW = cols * slotSize + (cols - 1) * gap;
        const startX = (1280 - totalRowW) / 2;
        const startY = 110;

        allConfigs.forEach((config, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * (slotSize + gap);
            const y = startY + row * (slotSize + 30);

            const slot = new MenuSlot(this.scene, x, y, slotSize, () => {
                // 检查是否已有该装备（防止重复获取）
                const allEquip = [
                    ...gameState.inventory.equipment,
                    ...gameState.inventory.items,
                ];
                const existing = allEquip.find(eq => eq.id === config.id);
                if (existing) {
                    console.log(`[调试] 已拥有 ${config.name}，跳过`);
                    return;
                }

                const eq = createEquipment(config.id);
                if (!eq) return;

                // 优先装备到空槽位
                if (gameState.inventory.equipment.length < 7) {
                    gameState.inventory.equipment.push(eq);
                    console.log(`[调试] 获取了 ${eq.name}（已装备）`);
                } else if (gameState.inventory.items.length < 10) {
                    gameState.inventory.items.push(eq);
                    console.log(`[调试] 获取了 ${eq.name}（已放入背包）`);
                } else {
                    console.log('[调试] 装备栏和背包已满');
                }

                this.refresh();
            }, 0, this.container, this.tooltip);

            // 显示装备名
            const displayEq = {
                name: config.name,
                category: config.category,
                description: config.description,
                value: config.value,
                cooldown: config.cooldown,
            };
            slot.setEquipment(displayEq);

            // 检查是否已拥有
            const allEquip = [
                ...gameState.inventory.equipment,
                ...gameState.inventory.items,
            ];
            const owned = allEquip.find(eq => eq.id === config.id);
            if (owned) {
                slot.label.setColor('#44ff44');
            }

            this.slots.push(slot);
        });
    }
}