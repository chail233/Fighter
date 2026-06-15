// GameManager - 全局游戏逻辑调度单例
// 职责：处理和管理各种游戏逻辑
// 不应：存储游戏数据、显示 UI

import gameState from './GameState.js';

class GameManager {
    constructor() {
        if (GameManager._instance) {
            return GameManager._instance;
        }
        GameManager._instance = this;
    }

    /**
     * 造成伤害
     * @param {number} damage - 原始伤害值（来自装备）
     * @param {object} defender - 防御者（包含 hp, defense 属性）
     * @returns {number} 实际造成的伤害值
     */
    dealDamage(damage, defender) {
        const actual = Math.max(1, damage - defender.defense);
        defender.hp = Math.max(0, defender.hp - actual);
        return actual;
    }

    /**
     * 恢复生命
     * @param {object} target - 目标（包含 hp, maxHp 属性）
     * @param {number} amount - 恢复量
     * @returns {number} 实际恢复值
     */
    heal(target, amount) {
        const before = target.hp;
        target.hp = Math.min(target.maxHp, target.hp + amount);
        return target.hp - before;
    }

    /**
     * 触发单个装备的使用
     * @param {object} equipment - 装备实例
     * @param {object} owner - 装备持有者
     * @param {object} target - 目标
     */
    useEquipment(equipment, owner, target) {
        if (equipment.isReady) {
            equipment.use(owner, target);
        }
    }

    /** 主更新循环，由场景每帧调用 */
    update(delta) {
        // 更新玩家装备 CD 并自动触发
        for (const eq of gameState.inventory.equipment) {
            eq.update(delta, gameState.player);
            if (eq.isReady) {
                this.useEquipment(eq, gameState.player, gameState.enemy);
            }
        }

        // 更新敌人装备 CD 并自动触发
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