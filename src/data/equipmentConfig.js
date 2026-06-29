// equipmentConfig - 装备静态配置
// 职责：定义装备的原始数据，不包含运行时状态
// 不应：修改游戏逻辑

import { Equipment } from '../entities/Equipment.js';
import gameState from '../GameState.js';

/**
 * 根据配置创建装备实例
 * @param {string} id - 装备标识
 * @returns {Equipment|null}
 */
export function createEquipment(id) {
    const config = EQUIPMENT_CONFIGS[id];
    if (!config) return null;
    return new Equipment(config);
}

export const EQUIPMENT_CATEGORIES = {
    weapon: { name: '武器', color: '#ff6644' },
    armor: { name: '防护', color: '#44aaff' },
    module: { name: '模块', color: '#44ff88' },
    tactic: { name: '战术', color: '#ffaa44' },
};

export const EQUIPMENT_CONFIGS = {
    '97-gun': {
        id: '97-gun',
        name: '九七式机枪',
        category: 'weapon',
        description: '快速射击，每次造成攻击伤害',
        value: 10,
        price: 50,
        cooldown: 2,
        effect: (owner, target, gm, eq) => {
            gm.weaponAttack(owner, target, eq);
        },
    },
    '89-gun': {
        id: '89-gun',
        name: '八九式机枪',
        category: 'weapon',
        description: '快速射击，每次造成攻击伤害',
        value: 10,
        price: 50,
        cooldown: 2,
        effect: (owner, target, gm, eq) => {
            gm.weaponAttack(owner, target, eq);
        },
    },
    '3year-gun': {
        id: '3year-gun',
        name: '三年式机枪',
        category: 'weapon',
        description: '大口径机枪，每次攻击使其他武器类别的装备迟滞0.2s',
        value: 25,
        price: 80,
        cooldown: 4,
        effect: (owner, target, gm, eq) => {
            gm.weaponAttack(owner, target, eq);
            // 迟滞其他武器类别的装备（通过 owner.equipment 获取装备列表）
            const list = owner.equipment || [];
            for (const other of list) {
                if (other === eq || other.category !== 'weapon') continue;
                if (other.cooldownTimer > 0) {
                    gm.modifyCooldown(other, 0.2);
                }
            }
        },
    },
    '1st-gun': {
        id: '1st-gun',
        name: '一式机枪',
        category: 'weapon',
        description: '其他武器攻击时，本武器加速0.1s',
        value: 20,
        price: 80,
        cooldown: 6,
        effect: (owner, target, gm, eq) => {
            gm.weaponAttack(owner, target, eq);
        },
    },
    '99-cannon': {
        id: '99-cannon',
        name: '九九式机炮',
        category: 'weapon',
        description: '相邻武器攻击时，本武器强度+10',
        value: 30,
        price: 200,
        cooldown: 8,
        effect: (owner, target, gm, eq) => {
            gm.weaponAttack(owner, target, eq);
        },
    },
    '99-cannon-2': {
        id: '99-cannon-2',
        name: '九九式机炮二号',
        category: 'weapon',
        description: '相邻武器攻击时，本武器强度翻倍',
        value: 16,
        price: 400,
        cooldown: 8,
        effect: (owner, target, gm, eq) => {
            gm.weaponAttack(owner, target, eq);
        },
    },
    'ho-155': {
        id: 'ho-155',
        name: 'ho-155 30mm机炮',
        category: 'weapon',
        description: '攻击时，额外造成敌机十分之一生命值的伤害',
        value: 50,
        price: 520,
        cooldown: 12,
        effect: (owner, target, gm, eq) => {
            gm.weaponAttack(owner, target, eq);
            // 额外造成目标当前生命值 10% 的伤害
            const bonus = Math.floor(target.hp * 0.1);
            gm.dealDamage(bonus, target, target.name, eq.name + '(额外)');
        },
    },
    '5-cannon': {
        id: '5-cannon',
        name: '五式机炮',
        category: 'weapon',
        description: '攻击时，额外造成己方生命值十分之一生命值的伤害',
        value: 50,
        price: 520,
        cooldown: 12,
        effect: (owner, target, gm, eq) => {
            gm.weaponAttack(owner, target, eq);
            const bonus = Math.floor(owner.hp * 0.1);
            gm.dealDamage(bonus, target, target.name, eq.name + '(额外)');
        },
    },
    '89-revolving-gun': {
        id: '89-revolving-gun',
        name: '八九式回旋机枪',
        category: 'weapon',
        description: '己方受到攻击时，立即反击',
        value: 5,
        price: 100,
        cooldown: 3,
        effect: (owner, target, gm, eq) => {
            gm.weaponAttack(owner, target, eq);
        },
    },
    '92-gun': {
        id: '92-gun',
        name: '九二式机枪',
        category: 'weapon',
        description: '己方受到攻击时，强度+2',
        value: 5,
        price: 200,
        cooldown: 2.5,
        effect: (owner, target, gm, eq) => {
            gm.weaponAttack(owner, target, eq);
        },
    },
    '70mm-rocket': {
        id: '70mm-rocket',
        name: '70mm火箭弹',
        category: 'weapon',
        description: '攻击时，使敌机所有装备迟滞0.2s',
        value: 35,
        price: 220,
        cooldown: 7,
        effect: (owner, target, gm, eq) => {
            gm.weaponAttack(owner, target, eq);
            // 迟滞敌人所有装备
            const list = target.equipment || [];
            for (const other of list) {
                if (other.cooldownTimer > 0) {
                    gm.modifyCooldown(other, 0.2);
                }
            }
        },
    },
    '120mm-rocket': {
        id: '120mm-rocket',
        name: '120mm火箭弹',
        category: 'weapon',
        description: '攻击时，使敌机一件装备迟滞5s',
        value: 70,
        price: 400,
        cooldown: 10,
        effect: (owner, target, gm, eq) => {
            gm.weaponAttack(owner, target, eq);
            // 随机选一件敌人装备迟滞5s
            const list = target.equipment || [];
            const candidates = list.filter(other => other.cooldownTimer > 0);
            if (candidates.length > 0) {
                const targetEq = candidates[Math.floor(Math.random() * candidates.length)];
                gm.modifyCooldown(targetEq, 5);
            }
        },
    },
    '13mm-back-armor': {
        id: '13mm-back-armor',
        name: '13mm背部防弹钢板',
        category: 'armor',
        description: '周期性提供防护值，抵御敌方攻击',
        value: 10,
        price: 90,
        cooldown: 5,
        effect: (owner, target, gm, eq) => {
            // BattleSystem.update 中 owner 是浅拷贝，通过 equipment 数组引用判断真实所有者
            const realOwner = owner.equipment === gameState.inventory.equipment
                ? gameState.player
                : gameState.enemy;
            // 增加防护值
            realOwner.shield += eq.value;
            gm.log(`[${eq.name}] 提供 ${eq.value} 点防护值 → ${realOwner.name}(防护 ${realOwner.shield})`);
        },
    },
};
