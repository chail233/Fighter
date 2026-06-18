// EquipmentPanel - 装备面板组件
// 职责：横向排列 7 个装备槽
// 不应：修改装备数据

import { EquipmentSlot } from './EquipmentSlot.js';
import { EQUIPMENT_SLOTS } from '../GameState.js';

export class EquipmentPanel {
    /**
     * @param {Phaser.Scene} scene - 所属场景
     * @param {number} x - 左上角 x
     * @param {number} y - 左上角 y
     * @param {number} slotSize - 每个格子的大小
     * @param {Tooltip} [tooltip] - 共享的提示框实例
     */
    constructor(scene, x, y, slotSize = 50, tooltip) {
        this.scene = scene;
        this.slots = [];

        const gap = 6;
        for (let i = 0; i < EQUIPMENT_SLOTS; i++) {
            const slotX = x + i * (slotSize + gap);
            const slot = new EquipmentSlot(scene, slotX, y, slotSize, tooltip);
            this.slots.push(slot);
        }
    }

    bindEquipment(equipmentList) {
        for (let i = 0; i < this.slots.length; i++) {
            const eq = i < equipmentList.length ? equipmentList[i] : null;
            this.slots[i].setEquipment(eq);
        }
    }

    update() {
        for (const slot of this.slots) {
            slot.update();
        }
    }

    destroy() {
        for (const slot of this.slots) {
            slot.destroy();
        }
    }
}