// BattleSystem - 战斗规则
// 职责：伤害计算、治疗、装备效果触发、战斗主循环
// 不应：管理背包/商店、显示 UI

import gameState from '../GameState.js';

class BattleSystem {
    constructor() {
        this.log = () => {};
    }

    bindLogger(logFn) {
        this.log = logFn;
    }

    /**
     * 造成伤害
     * @param {number} damage - 原始伤害值
     * @param {object} defender - 防御者
     * @param {string} defenderName - 防御者名称
     * @param {string} sourceName - 伤害来源名称
     */
    dealDamage(damage, defender, defenderName, sourceName) {
        const actual = Math.max(1, damage - defender.defense);
        defender.hp = Math.max(0, defender.hp - actual);
        this.log(`[${sourceName}] 造成 ${actual} 点伤害 → ${defenderName}(${defender.hp}/${defender.maxHp})`);
        return actual;
    }

    /**
     * 恢复生命
     * @param {object} target - 目标
     * @param {number} amount - 恢复量
     * @param {string} targetName - 目标名称
     */
    heal(target, amount, targetName) {
        const before = target.hp;
        target.hp = Math.min(target.maxHp, target.hp + amount);
        const actual = target.hp - before;
        if (actual > 0) {
            this.log(`[治疗] ${targetName} 恢复 ${actual} 点生命值`);
        }
        return actual;
    }

    /**
     * 触发一件装备
     */
    useEquipment(equipment, owner, target) {
        if (equipment.isReady) {
            equipment.use(owner, target);
        }
    }

    /**
     * 主循环：更新双方装备 CD，自动触发就绪装备
     */
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

export const battleSystem = new BattleSystem();