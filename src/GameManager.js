// GameManager - 全局游戏逻辑调度单例
// 职责：处理和管理各种游戏逻辑
// 不应：存储游戏数据、显示 UI

import gameState from './GameState.js';
import { CombatLog } from './ui/CombatLog.js';
import { createEquipment, EQUIPMENT_CONFIGS } from './data/equipmentConfig.js';

class GameManager {
    constructor() {
        if (GameManager._instance) {
            return GameManager._instance;
        }
        GameManager._instance = this;

        this.combatLog = null;
    }

    // ========== 日志 ==========

    bindLog(combatLog) {
        this.combatLog = combatLog;
    }

    log(text) {
        if (this.combatLog) {
            this.combatLog.add(text);
        }
    }

    // ========== 战斗数值 ==========

    dealDamage(damage, defender, defenderName, sourceName) {
        const actual = Math.max(1, damage - defender.defense);
        defender.hp = Math.max(0, defender.hp - actual);
        this.log(`[${sourceName}] 造成 ${actual} 点伤害 → ${defenderName}(${defender.hp}/${defender.maxHp})`);
        return actual;
    }

    heal(target, amount, targetName) {
        const before = target.hp;
        target.hp = Math.min(target.maxHp, target.hp + amount);
        const actual = target.hp - before;
        if (actual > 0) {
            this.log(`[治疗] ${targetName} 恢复 ${actual} 点生命值`);
        }
        return actual;
    }

    // ========== 装备操作 ==========

    /** 从背包装备到指定槽位 */
    equip(fromBackpackIndex) {
        if (fromBackpackIndex < 0 || fromBackpackIndex >= gameState.inventory.items.length) return false;
        if (gameState.inventory.equipment.length >= 7) return false;

        const [eq] = gameState.inventory.items.splice(fromBackpackIndex, 1);
        gameState.inventory.equipment.push(eq);
        this.log(`[装备] 装备了 ${eq.name}`);
        return true;
    }

    /** 卸下装备到背包 */
    unequip(equipSlotIndex) {
        if (equipSlotIndex < 0 || equipSlotIndex >= gameState.inventory.equipment.length) return false;
        if (gameState.inventory.items.length >= 10) return false;

        const [eq] = gameState.inventory.equipment.splice(equipSlotIndex, 1);
        gameState.inventory.items.push(eq);
        this.log(`[卸装] 卸下了 ${eq.name}`);
        return true;
    }

    /** 交换两个装备栏位置 */
    swapEquipment(indexA, indexB) {
        const equip = gameState.inventory.equipment;
        if (indexA < 0 || indexA >= equip.length) return false;
        if (indexB < 0 || indexB >= equip.length) return false;
        [equip[indexA], equip[indexB]] = [equip[indexB], equip[indexA]];
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
        if (gameState.inventory.items.length >= 10) {
            // 退还金币
            this.addGold(config.price);
            return null;
        }

        const eq = createEquipment(id);
        gameState.inventory.items.push(eq);
        this.log(`[购买] 买了 ${eq.name}，花费 ${config.price}G`);
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

    // ========== 触发装备效果 ==========

    useEquipment(equipment, owner, target) {
        if (equipment.isReady) {
            equipment.use(owner, target);
        }
    }

    // ========== 主循环 ==========

    update(delta) {
        for (const eq of gameState.inventory.equipment) {
            eq.update(delta, gameState.player);
            if (eq.isReady) {
                this.useEquipment(eq, gameState.player, gameState.enemy);
            }
        }

        for (const eq of gameState.enemy.equipment) {
            eq.update(delta, gameState.enemy);
            if (eq.isReady) {
                this.useEquipment(eq, gameState.enemy, gameState.player);
            }
        }
    }
}

const gameManager = new GameManager();
export default gameManager;