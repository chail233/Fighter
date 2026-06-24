// storyEvents - 剧情事件目录
// 职责：结构化定义所有剧情节点的内容，与关卡配置解耦
// 不应：包含运行时状态或 UI 逻辑

/**
 * ========== 剧情事件结构 ==========
 *
 * 每个事件包含：
 *   id         唯一标识，与 stageConfig 中 story 节点的 eventId 对应
 *   sections[] 剧情段落数组，按顺序播放
 *
 * 段落（section）字段：
 *   speaker  说话人（可选，如 '指挥官'、'你'）
 *   text     台词/叙述文本（支持 \n 换行）
 *   emotion  情绪标识（可选，用于未来扩展头像表情）
 *
 * 可扩展：未来可以给段落添加 background（背景图）、sfx（音效）、
 *         choices（选项分支）等字段，不影响现有结构。
 */

export const STORY_EVENTS = {
    // ===== 第 1 关 =====
    '1-opening': {
        id: '1-opening',
        title: '初阵',
        sections: [
            {
                speaker: null,
                text: '1937年，华东前线机场。',
            },
            {
                speaker: '指挥官',
                text: '"小子，敌人侦察机就在附近，升空拦截！这是你第一次实战，别让中队丢脸。"',
            },
            {
                speaker: null,
                text: '地勤人员帮你检查了飞机，一切就绪。你爬进座舱，发动机轰鸣声响起。',
            },
        ],
    },
    '1-ending': {
        id: '1-ending',
        title: '首战告捷',
        sections: [
            {
                speaker: null,
                text: '首战告捷！你成功击退了敌侦察机。',
            },
            {
                speaker: '指挥官',
                text: '"干得不错，但战争才刚刚开始。回基地休整，后面还有更多敌机等着你。"',
            },
            {
                speaker: null,
                text: '解锁装备：八九式机枪',
            },
        ],
    },

    // ===== 第 2 关 =====
    '2-opening': {
        id: '2-opening',
        title: '敌机来袭',
        sections: [
            {
                speaker: null,
                text: '第二天清晨，警报响起。',
            },
            {
                speaker: '指挥官',
                text: '"敌机编队正在接近！全员升空！这次来的可不是侦察机，是正经的战斗机编队。"',
            },
            {
                speaker: null,
                text: '你冲向跑道，紧随长机起飞。',
            },
        ],
    },
    '2-mid': {
        id: '2-mid',
        title: '紧急转向',
        sections: [
            {
                speaker: null,
                text: '你击落了第一架敌机。但通讯器传来急促的声音：',
            },
            {
                speaker: '通讯器',
                text: '"发现更多敌机！三点钟方向！"',
            },
            {
                speaker: null,
                text: '你猛地拉杆转向，又一场战斗在等着你。',
            },
        ],
    },
    '2-ending': {
        id: '2-ending',
        title: '连胜',
        sections: [
            {
                speaker: null,
                text: '连续击落两架敌机，你已经证明了自己的实力。',
            },
            {
                speaker: '工程师',
                text: '"敌人的装备越来越好了，我们也得跟上。"',
            },
            {
                speaker: null,
                text: '解锁装备：三年式机枪',
            },
        ],
    },

    // ===== 第 3 关 =====
    '3-opening': {
        id: '3-opening',
        title: '紧急出击',
        sections: [
            {
                speaker: null,
                text: '前线指挥部。',
            },
            {
                speaker: '情报官',
                text: '"根据最新情报，敌军调集了更多兵力，准备对我方机场发动大规模空袭。我们必须提前出击，打乱他们的部署。"',
            },
        ],
    },
    '3-mid': {
        id: '3-mid',
        title: '王牌现身',
        sections: [
            {
                speaker: null,
                text: '"打得好！但别放松——王牌来了！"',
            },
        ],
    },
    '3-ending': {
        id: '3-ending',
        title: '击落王牌',
        sections: [
            {
                speaker: null,
                text: '王牌飞行员被击落！你获得了他的部分装备。',
            },
            {
                speaker: '情报官',
                text: '"干得漂亮！不过敌军正在开发新型武器，我们的情报人员正在调查。"',
            },
            {
                speaker: null,
                text: '解锁装备：九九式机炮、九九式机炮二号',
            },
        ],
    },

    // ===== 第 4 关 =====
    '4-opening': {
        id: '4-opening',
        title: '新装备',
        sections: [
            {
                speaker: null,
                text: '机库中，机械师正在为你安装新装备。',
            },
            {
                speaker: '机械师',
                text: '"敌人的武器越来越厉害了，不过我们也搞到了一些新玩意儿。"',
            },
            {
                speaker: null,
                text: '他拍了拍你的机翼："试试这些新装备吧。"',
            },
        ],
    },
    '4-mid': {
        id: '4-mid',
        title: '新威胁',
        sections: [
            {
                speaker: null,
                text: '轰炸机被击落，但战场上空出现了新的威胁。',
            },
        ],
    },
    '4-ending': {
        id: '4-ending',
        title: '试验机残骸',
        sections: [
            {
                speaker: null,
                text: '你击落了敌军试验机！带回了珍贵的情报。',
            },
            {
                speaker: null,
                text: '解锁装备：ho-155 30mm机炮、九二式机枪',
            },
        ],
    },

    // ===== 第 5 关 =====
    '5-opening': {
        id: '5-opening',
        title: '紧急升空',
        sections: [
            {
                speaker: null,
                text: '雷达站报告：大规模敌机编队正在接近！',
            },
            {
                speaker: '指挥官',
                text: '"这不是普通的编队——是重型轰炸机群，目标就是我们的基地！所有战机紧急升空！"',
            },
        ],
    },
    '5-mid': {
        id: '5-mid',
        title: '追击',
        sections: [
            {
                speaker: null,
                text: '一架轰炸机拖着浓烟坠落。',
            },
            {
                speaker: null,
                text: '但更多的轰炸机正在逼近基地。你没有时间休息，立刻转向追击下一架。',
            },
        ],
    },
    '5-ending': {
        id: '5-ending',
        title: '胜利',
        sections: [
            {
                speaker: null,
                text: '轰炸机群被成功拦截，基地保住了！',
            },
            {
                speaker: '指挥官',
                text: '"你今天的表现超出了所有人预期。战争还会继续，但你已经证明了自己是真正的王牌。"',
            },
            {
                speaker: null,
                text: '解锁装备：70mm火箭弹、120mm火箭弹',
            },
        ],
    },
};

/**
 * 根据事件 ID 获取剧情事件
 */
export function getStoryEvent(eventId) {
    return STORY_EVENTS[eventId] || null;
}