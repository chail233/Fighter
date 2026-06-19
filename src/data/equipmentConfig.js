// equipmentConfig - 装备静态配置
// 职责：定义装备的原始数据，不包含运行时状态
// 不应：修改游戏逻辑

import { Equipment } from '../entities/Equipment.js';

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
            gm.dealDamage(eq.value, target, target.name, eq.name);
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
            gm.dealDamage(eq.value, target, target.name, eq.name);
        },
    },
    '3year-gun': {
        id: '3year-gun',
        name: '三年式机枪',
        category: 'weapon',
        description: '大口径机枪，每次攻击使其他武器类别的装备迟滞0.5s',
        value: 40,
        price: 80,
        cooldown: 3.5,
        effect: (owner, target, gm, eq) => {
            gm.dealDamage(eq.value, target, target.name, eq.name);
            // 迟滞其他武器类别的装备（通过 owner.equipment 获取装备列表）
            const list = owner.equipment || [];
            for (const other of list) {
                if (other === eq || other.category !== 'weapon') continue;
                if (other.cooldownTimer > 0) {
                    gm.modifyCooldown(other, 0.5);
                }
            }
        },
    },
};
