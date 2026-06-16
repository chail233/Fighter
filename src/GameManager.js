// GameManager - 全局游戏逻辑调度单例（协调层）
// 职责：串联各个 System，对外暴露统一的接口
// 不应：存储游戏数据、显示 UI

import { battleSystem } from './systems/BattleSystem.js';
import { inventorySystem } from './systems/InventorySystem.js';

class GameManager {
    constructor() {
        if (GameManager._instance) {
            return GameManager._instance;
        }
        GameManager._instance = this;
    }

    // ========== 日志绑定 ==========

    bindLog(combatLog) {
        battleSystem.bindLogger((text) => combatLog.add(text));
    }

    // ========== 战斗（委托 BattleSystem） ==========

    dealDamage(damage, defender, defenderName, sourceName) {
        return battleSystem.dealDamage(damage, defender, defenderName, sourceName);
    }

    heal(target, amount, targetName) {
        return battleSystem.heal(target, amount, targetName);
    }

    useEquipment(equipment, owner, target) {
        return battleSystem.useEquipment(equipment, owner, target);
    }

    update(delta) {
        battleSystem.update(delta);
    }

    // ========== 背包/商店（委托 InventorySystem） ==========

    equip(fromBackpackIndex) {
        return inventorySystem.equip(fromBackpackIndex);
    }

    unequip(equipSlotIndex) {
        return inventorySystem.unequip(equipSlotIndex);
    }

    swapEquipment(indexA, indexB) {
        return inventorySystem.swapEquipment(indexA, indexB);
    }

    handleEquipSlotClick(slotIndex) {
        return inventorySystem.handleEquipSlotClick(slotIndex);
    }

    handleBackpackClick(backpackIndex) {
        return inventorySystem.handleBackpackClick(backpackIndex);
    }

    equipEnemy(equipment) {
        return inventorySystem.equipEnemy(equipment);
    }

    addGold(amount) {
        inventorySystem.addGold(amount);
    }

    spendGold(amount) {
        return inventorySystem.spendGold(amount);
    }

    buyEquipment(id) {
        return inventorySystem.buyEquipment(id);
    }

    sellEquipment(backpackIndex) {
        return inventorySystem.sellEquipment(backpackIndex);
    }

    initNewGame() {
        inventorySystem.initNewGame();
    }
}

const gameManager = new GameManager();
export default gameManager;