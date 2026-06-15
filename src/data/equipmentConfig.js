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

export const EQUIPMENT_CONFIGS = {
    gun: {
        id: 'gun',
        name: '机枪',
        description: '快速射击，每次造成攻击伤害,并使装备强度加1',
        value: 10,
        cooldown: 1,
        effect: (owner, target, gm, eq) => {
            gm.dealDamage(eq.value, target);
            eq.value += 1;
        },
    },
};