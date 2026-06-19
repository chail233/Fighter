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
     */
    dealDamage(damage, defender, defenderName, sourceName) {
        const actual = Math.max(1, damage - defender.defense);
        defender.hp = Math.max(0, defender.hp - actual);
        this.log(`[${sourceName}] 造成 ${actual} 点伤害 → ${defenderName}(${defender.hp}/${defender.maxHp})`);
        return actual;
    }

    /** 统一武器攻击入口（箭头函数自动绑定 this） */
    weaponAttack = (owner, target, weapon) => {
        this.dealDamage(weapon.value, target, target.name, weapon.name);

        // 全局被动：场上任意武器攻击时，一式机枪加速 0.1s
        if (weapon.category === 'weapon') {
            const list = owner.equipment || [];
            for (const eq of list) {
                if (eq.id === '1st-gun' && eq.cooldownTimer > 0) {
                    this.modifyCooldown(eq, -0.1);
                }
            }
        }
    };

    /**
     * 触发一件装备
     */
    useEquipment(equipment, owner, target) {
        if (equipment.isReady) {
            equipment.use(owner, target);
        }
    }

    /**
     * 修改装备冷却时间（封装，避免直接访问 cooldownTimer）
     */
    modifyCooldown(equipment, delta) {
        if (!equipment) return;
        equipment.cooldownTimer = Math.max(0, Math.min(equipment.cooldownTimer + delta, equipment.cooldown));
    }

    /**
     * 修改装备强度（封装，避免直接访问 value）
     */
    modifyValue(equipment, delta) {
        if (!equipment) return;
        equipment.value = Math.max(0, equipment.value + delta);
    }

    /**
     * 主循环：更新双方装备 CD，自动触发就绪装备
     */
    update(delta) {
        const playerWithEquip = { ...gameState.player, equipment: gameState.inventory.equipment };
        for (const eq of gameState.inventory.equipment) {
            eq.update(delta, playerWithEquip);
            if (eq.isReady) {
                this.useEquipment(eq, playerWithEquip, gameState.enemy);
            }
        }

        const enemyWithEquip = { ...gameState.enemy, equipment: gameState.enemy.equipment };
        for (const eq of gameState.enemy.equipment) {
            eq.update(delta, enemyWithEquip);
            if (eq.isReady) {
                this.useEquipment(eq, enemyWithEquip, gameState.player);
            }
        }
    }
}

export const battleSystem = new BattleSystem();