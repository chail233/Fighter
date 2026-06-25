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
 *   - music         本关默认音乐（可选）
 *       menu       菜单 BGM key，缺省 'Menu1'
 *       battle     战斗 BGM key，缺省随机 Battle0~4
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
 *   music   本场战斗 BGM key（可选，缺省继承自关卡）
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
    // 第 1 关：初阵
    // ============================================================
    {
        id: 1,
        name: '初阵',
        description: '初上战场，面对零散的敌机侦察，检验你的飞行技术。',
        music: {
            menu: 'Battle4',
            battle: 'Menu1'
        },
        nodes: [
            {
                id: '1-1',
                type: 'story',
                eventId: '1-opening',
            },
            {
                id: '1-2',
                type: 'battle',
                text: '你爬升到三千米高度，云层中隐约看到一架敌机。',
                enemy: {
                    name: '九七式侦察机',
                    texture: 'N1K-J',
                    hp: 400,
                    maxHp: 400,
                    defense: 0,
                    equipment: ['97-gun'],
                },
                rewards: { gold: 50, items: ['89-gun'] },
            },
            {
                id: '1-3',
                type: 'story',
                eventId: '1-ending',
            },
        ],
    },

    // ============================================================
    // 第 2 关：敌机来袭
    // ============================================================
    {
        id: 2,
        name: '敌机来袭',
        description: '敌人增援到达，开始出现编队作战。',
        nodes: [
            {
                id: '2-1',
                type: 'story',
                eventId: '2-opening',
            },
            {
                id: '2-2',
                type: 'battle',
                text: '前方出现两架敌机，成双机编队向你飞来。',
                enemy: {
                    name: '八九式战斗机',
                    texture: 'N1K-J',
                    hp: 500,
                    maxHp: 500,
                    defense: 0,
                    equipment: ['89-gun'],
                },
                rewards: { gold: 60 },
            },
            {
                id: '2-3',
                type: 'story',
                eventId: '2-mid',
            },
            {
                id: '2-4',
                type: 'battle',
                text: '一架一式战斗机从云层中俯冲而下！',
                enemy: {
                    name: '一式战斗机',
                    texture: 'Ki-61',
                    hp: 600,
                    maxHp: 600,
                    defense: 0,
                    equipment: ['1st-gun'],
                },
                rewards: { gold: 80, items: ['3year-gun'] },
            },
            {
                id: '2-5',
                type: 'story',
                eventId: '2-ending',
            },
        ],
    },

    // ============================================================
    // 第 3 关：编队作战
    // ============================================================
    {
        id: 3,
        name: '编队作战',
        description: '敌人开始采用双机编队战术，协同攻击。',
        music: {
            menu: 'Menu1',
            battle: 'Battle0',
        },
        nodes: [
            {
                id: '3-1',
                type: 'story',
                eventId: '3-opening',
            },
            {
                id: '3-2',
                type: 'battle',
                text: '敌编队已经升空，两架九九式机炮战机正在低空巡逻。',
                enemy: {
                    name: '九九式双机编队',
                    texture: 'N1K-J',
                    hp: 700,
                    maxHp: 700,
                    defense: 0,
                    equipment: ['89-gun', '99-cannon'],
                },
                rewards: { gold: 100, items: ['99-cannon'] },
            },
            {
                id: '3-3',
                type: 'story',
                eventId: '3-mid',
            },
            {
                id: '3-4',
                type: 'battle',
                music: 'Battle2',
                text: '一架涂装独特的零式战斗机冲入战场，飞行员明显是经验丰富的老手。',
                enemy: {
                    name: '零式战斗机·初号机',
                    texture: 'N1K-J',
                    hp: 900,
                    maxHp: 900,
                    defense: 0,
                    equipment: ['97-gun', '1st-gun', '89-revolving-gun'],
                },
                rewards: { gold: 150, items: ['99-cannon-2'] },
            },
            {
                id: '3-5',
                type: 'story',
                eventId: '3-ending',
            },
        ],
    },

    // ============================================================
    // 第 4 关：新锐武器
    // ============================================================
    {
        id: 4,
        name: '新锐武器',
        description: '装备了新型武器的敌机出现在战场上。',
        nodes: [
            {
                id: '4-1',
                type: 'story',
                eventId: '4-opening',
            },
            {
                id: '4-2',
                type: 'battle',
                text: '一架重装甲的九九式重爆机正在向地面阵地俯冲轰炸。',
                enemy: {
                    name: '九九式重爆机',
                    texture: 'N1K-J',
                    hp: 1000,
                    maxHp: 1000,
                    defense: 5,
                    equipment: ['99-cannon', '92-gun'],
                },
                rewards: { gold: 120 },
            },
            {
                id: '4-3',
                type: 'story',
                eventId: '4-mid',
            },
            {
                id: '4-4',
                type: 'battle',
                text: '紫电改试作型——敌军最新锐的试验机！',
                enemy: {
                    name: '紫电改·试作型',
                    texture: 'Ki-61',
                    hp: 1100,
                    maxHp: 1100,
                    defense: 0,
                    equipment: ['ho-155', '1st-gun'],
                },
                rewards: { gold: 180, items: ['ho-155'] },
            },
            {
                id: '4-5',
                type: 'story',
                eventId: '4-ending',
            },
        ],
    },

    // ============================================================
    // 第 5 关：空中堡垒
    // ============================================================
    {
        id: 5,
        name: '空中堡垒',
        description: '敌方重型轰炸机编队来袭，必须阻止它们！',
        nodes: [
            {
                id: '5-1',
                type: 'story',
                eventId: '5-opening',
            },
            {
                id: '5-2',
                type: 'battle',
                text: '庞大的百式重型轰炸机出现在视野中，周围有护航战机。',
                enemy: {
                    name: '百式重型轰炸机',
                    texture: 'N1K-J',
                    hp: 1500,
                    maxHp: 1500,
                    defense: 10,
                    equipment: ['92-gun', '92-gun', '89-revolving-gun'],
                },
                rewards: { gold: 200, items: ['70mm-rocket'] },
            },
            {
                id: '5-3',
                type: 'story',
                eventId: '5-mid',
            },
            {
                id: '5-4',
                type: 'battle',
                text: '第二波轰炸机编队，护航火力更加凶猛。',
                enemy: {
                    name: '百式轰炸机·二番机',
                    texture: 'N1K-J',
                    hp: 1600,
                    maxHp: 1600,
                    defense: 10,
                    equipment: ['92-gun', '99-cannon-2', '89-revolving-gun'],
                },
                rewards: { gold: 220, items: ['120mm-rocket'] },
            },
            {
                id: '5-5',
                type: 'story',
                eventId: '5-ending',
            },
        ],
    },
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

/**
 * 获取关卡的菜单 BGM key
 * 缺省 'Menu1'
 */
export function getStageMenuMusic(stage) {
    if (stage && stage.music && stage.music.menu) return stage.music.menu;
    return 'Menu1';
}

/**
 * 获取战斗节点的 BGM key
 * 优先级：节点 music → 关卡 music.battle → 随机 Battle0~4
 */
export function getStageBattleMusic(stage, node) {
    if (node && node.music) return node.music;
    if (stage && stage.music && stage.music.battle) return stage.music.battle;
    return `Battle${Math.floor(Math.random() * 5)}`;
}
