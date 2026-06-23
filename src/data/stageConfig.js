// stageConfig - 关卡与节点配置模板
// 职责：定义线性游戏流程中所有节点（剧情/战斗）
// 不应：包含运行时状态或 UI 逻辑

/**
 * ========== 节点类型 ==========
 *
 * story  剧情文本    | 显示文本后点击继续进入下一节点
 * battle 战斗遭遇    | 进入战斗前自动回满血量；战斗胜利后进入下一节点
 *
 * ========== 关卡通解构 ==========
 *
 * STAGES 是一个数组，每个元素代表"一章/一关"。
 * 每关包含：
 *   - id            关卡编号
 *   - name          关卡名称
 *   - description   关卡简介（在战役页面展示）
 *   - nodes[]       本关的节点列表，按顺序执行
 *
 * ========== 节点字段 ==========
 *
 * 通用字段：
 *   id       节点唯一标识（如 '1-1'）
 *   type     'story' | 'battle'
 *   text     节点描述文本
 *
 * type: 'story'
 *   text  剧情文本（支持 \n 换行）
 *
 * type: 'battle'
 *   text    战斗前的简短描述
 *   enemy: {
 *     name      敌人显示名称
 *     texture   飞机贴图文件名（不含路径）
 *     hp        生命值
 *     maxHp     最大生命值
 *     defense   防御力
 *     equipment 敌人装备 ID 数组（从 equipmentConfig 创建）
 *   }
 *   rewards: {
 *     gold   金币奖励
 *     items  掉落装备 ID 数组（可选）
 *   }
 *
 * 注意：每次进入 battle 节点前，玩家飞机会自动回满血量。
 */

export const STAGES = [
    // ============================================================
    // 关卡模板 - 复制此块编写新关卡
    // ============================================================
    // {
    //     id: 1,
    //     name: '示例关卡',
    //     description: '关卡简介',
    //     nodes: [
    //         {
    //             id: '1-1',
    //             type: 'story',
    //             text: '剧情文本',
    //         },
    //         {
    //             id: '1-2',
    //             type: 'battle',
    //             text: '战斗前描述',
    //             enemy: {
    //                 name: '敌机名称',
    //                 texture: 'N1K-J',
    //                 hp: 500,
    //                 maxHp: 500,
    //                 defense: 0,
    //                 equipment: ['97-gun'],
    //             },
    //             rewards: { gold: 50, items: ['89-gun'] },
    //         },
    //     ],
    // },
];

/**
 * 根据关卡 ID 获取关卡配置
 */
export function getStageById(stageId) {
    return STAGES.find(s => s.id === stageId) || null;
}

/**
 * 获取关卡内所有战斗节点的敌人配置（用于生成敌人）
 */
export function getBattleEnemies(stage) {
    return stage.nodes.filter(n => n.type === 'battle').map(n => n.enemy);
}