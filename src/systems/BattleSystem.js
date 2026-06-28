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
        let actual = Math.max(1, damage - defender.defense);

        // 先扣除防护值
        if (defender.shield > 0) {
            const shieldDamage = Math.min(defender.shield, actual);
            defender.shield -= shieldDamage;
            actual -= shieldDamage;
            this.log(`[${sourceName}] 防护值抵消 ${shieldDamage} 点伤害 → ${defenderName}(防护 ${defender.shield}/${defender.maxShield})`);
        }

        // 剩余伤害扣除生命值
        if (actual > 0) {
            defender.hp = Math.max(0, defender.hp - actual);
            this.log(`[${sourceName}] 造成 ${actual} 点伤害 → ${defenderName}(${defender.hp}/${defender.maxHp})`);
        } else {
            this.log(`[${sourceName}] 伤害被完全抵挡！`);
        }

        // 受击方反击：检查是否有八九式回旋机枪
        this._triggerCounter(defender);

        return actual;
    }

    /**
     * 反击攻击入口（与 weaponAttack 类似，但不触发防反被动）
     */
    counterAttack(owner, target, weapon) {
        let actual = Math.max(1, weapon.value - target.defense);

        // 先扣除防护值
        if (target.shield > 0) {
            const shieldDamage = Math.min(target.shield, actual);
            target.shield -= shieldDamage;
            actual -= shieldDamage;
            this.log(`[${weapon.name}] 防护值抵消 ${shieldDamage} 点伤害 → ${target.name}(防护 ${target.shield}/${target.maxShield})`);
        }

        if (actual > 0) {
            target.hp = Math.max(0, target.hp - actual);
            this.log(`[${weapon.name}] 反击 ${actual} 点伤害 → ${target.name}(${target.hp}/${target.maxHp})`);
        } else {
            this.log(`[${weapon.name}] 反击被完全抵挡！`);
        }

        // 己方被动效果（一式加速、九九式相邻）正常触发
        if (weapon.category === 'weapon') {
            const list = owner.equipment || [];
            for (const eq of list) {
                if (eq.id === '1st-gun' && eq.cooldownTimer > 0) {
                    this.modifyCooldown(eq, -0.1);
                }
            }
            const idx = list.indexOf(weapon);
            if (idx !== -1) {
                if (idx > 0 && list[idx - 1].id === '99-cannon') {
                    this.modifyValue(list[idx - 1], 10);
                }
                if (idx < list.length - 1 && list[idx + 1].id === '99-cannon') {
                    this.modifyValue(list[idx + 1], 10);
                }
                if (idx > 0 && list[idx - 1].id === '99-cannon-2') {
                    this.modifyValue(list[idx - 1], list[idx - 1].value);
                }
                if (idx < list.length - 1 && list[idx + 1].id === '99-cannon-2') {
                    this.modifyValue(list[idx + 1], list[idx + 1].value);
                }
            }
        }
    }

    /**
     * 受击时触发己方八九式回旋机枪立即反击
     */
    _triggerCounter(defender) {
        let owner, target;
        // 通过引用比较判断受击方（gameState.player/enemy 直接作为 defender 传入）
        if (defender === gameState.player) {
            owner = { ...gameState.player, equipment: gameState.inventory.equipment };
            target = gameState.enemy;
        } else {
            owner = { ...gameState.enemy, equipment: gameState.enemy.equipment };
            target = gameState.player;
        }

        const list = owner.equipment || [];
        for (const eq of list) {
            if (eq.id === '89-revolving-gun') {
                this.counterAttack(owner, target, eq);
            }
            if (eq.id === '92-gun') {
                this.modifyValue(eq, 2);
                this.log(`[九二式机枪] 强度 +2（当前 ${eq.value}）`);
            }
        }
    }

    /** 统一武器攻击入口（箭头函数自动绑定 this） */
    weaponAttack = (owner, target, weapon) => {
        this.dealDamage(weapon.value, target, target.name, weapon.name);

        if (weapon.category === 'weapon') {
            const list = owner.equipment || [];
            // 一式机枪加速
            for (const eq of list) {
                if (eq.id === '1st-gun' && eq.cooldownTimer > 0) {
                    this.modifyCooldown(eq, -0.1);
                }
            }
            // 九九式机炮：相邻武器攻击时强度 +10
            // 九九式机炮二号：相邻武器攻击时强度翻倍
            const idx = list.indexOf(weapon);
            if (idx !== -1) {
                if (idx > 0 && list[idx - 1].id === '99-cannon') {
                    this.modifyValue(list[idx - 1], 10);
                }
                if (idx < list.length - 1 && list[idx + 1].id === '99-cannon') {
                    this.modifyValue(list[idx + 1], 10);
                }
                // 九九式机炮二号：相邻武器攻击时强度翻倍
                if (idx > 0 && list[idx - 1].id === '99-cannon-2') {
                    this.modifyValue(list[idx - 1], list[idx - 1].value);
                }
                if (idx < list.length - 1 && list[idx + 1].id === '99-cannon-2') {
                    this.modifyValue(list[idx + 1], list[idx + 1].value);
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