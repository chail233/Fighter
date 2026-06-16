// InventorySystem - 背包/装备管理规则
// 职责：装备/卸装/交换、金币管理、商店购买出售、游戏初始化
// 不应：战斗数值、显示 UI

import gameState from '../GameState.js';
import { createEquipment, EQUIPMENT_CONFIGS } from '../data/equipmentConfig.js';

class InventorySystem {
    constructor() {
        this.log = (text) => console.log(text);
    }

    bindLogger(logFn) {
        this.log = logFn;
    }

    // ========== 装备操作 ==========

    equip(fromBackpackIndex) {
        if (fromBackpackIndex < 0 || fromBackpackIndex >= gameState.inventory.items.length) return false;
        if (gameState.inventory.equipment.length >= 7) return false;

        const [eq] = gameState.inventory.items.splice(fromBackpackIndex, 1);
        gameState.inventory.equipment.push(eq);
        this.log(`[装备] 装备了 ${eq.name}`);
        return true;
    }

    unequip(equipSlotIndex) {
        if (equipSlotIndex < 0 || equipSlotIndex >= gameState.inventory.equipment.length) return false;
        if (gameState.inventory.items.length >= 10) return false;

        const [eq] = gameState.inventory.equipment.splice(equipSlotIndex, 1);
        gameState.inventory.items.push(eq);
        this.log(`[卸装] 卸下了 ${eq.name}`);
        return true;
    }

    swapEquipment(indexA, indexB) {
        const equip = gameState.inventory.equipment;
        if (indexA < 0 || indexA >= equip.length) return false;
        if (indexB < 0 || indexB >= equip.length) return false;
        [equip[indexA], equip[indexB]] = [equip[indexB], equip[indexA]];
        return true;
    }

    handleEquipSlotClick(slotIndex) {
        // 点击已有装备的槽位 → 卸下
        if (slotIndex < gameState.inventory.equipment.length) {
            return this.unequip(slotIndex);
        }
        // 点击空槽位 → 不做任何事
        return false;
    }

    handleBackpackClick(backpackIndex) {
        // 点击背包中的装备 → 装备到第一个空槽位
        if (gameState.inventory.equipment.length < 7) {
            return this.equip(backpackIndex);
        }
        return false;
    }

    // ========== 敌人装备 ==========

    equipEnemy(equipment) {
        if (gameState.enemy.equipment.length >= 7) return false;
        gameState.enemy.equipment.push(equipment);
        return true;
    }

    // ========== 金币操作 ==========

    addGold(amount) {
        gameState.player.gold += amount;
    }

    spendGold(amount) {
        if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) return false;
        if (gameState.player.gold < amount) return false;
        gameState.player.gold -= amount;
        return true;
    }

    // ========== 商店操作 ==========

    buyEquipment(id) {
        const config = EQUIPMENT_CONFIGS[id];
        if (!config) return null;

        if (!this.spendGold(config.price)) return null;

        const eq = createEquipment(id);
        if (!eq) {
            this.addGold(config.price);
            return null;
        }

        // 优先装备到空槽位
        if (gameState.inventory.equipment.length < 7) {
            gameState.inventory.equipment.push(eq);
            this.log(`[购买] 购买了 ${eq.name} 并已装备，花费 ${config.price}G`);
        } else if (gameState.inventory.items.length < 10) {
            gameState.inventory.items.push(eq);
            this.log(`[购买] 买了 ${eq.name}，花费 ${config.price}G（已放入背包）`);
        } else {
            this.addGold(config.price);
            this.log('[购买] 装备栏和背包已满');
            return null;
        }

        return eq;
    }

    sellEquipment(backpackIndex) {
        if (backpackIndex < 0 || backpackIndex >= gameState.inventory.items.length) return 0;

        const item = gameState.inventory.items[backpackIndex];
        const config = Object.values(EQUIPMENT_CONFIGS).find(c => c.id === item.id);
        const price = config ? Math.floor(config.price / 2) : 10;

        gameState.inventory.items.splice(backpackIndex, 1);
        this.addGold(price);
        this.log(`[出售] 出售了 ${item.name}，获得 ${price}G`);
        return price;
    }

    // ========== 初始化 ==========

    initNewGame() {
        const playerGun = createEquipment('gun');
        const enemyGun = createEquipment('gun');
        gameState.inventory.equipment.push(playerGun);
        gameState.enemy.equipment.push(enemyGun);
        gameState.player.gold = 100;
    }
}

export const inventorySystem = new InventorySystem();