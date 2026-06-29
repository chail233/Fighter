// GameState - 全局状态单例
// 职责：存储玩家和游戏运行时信息
// 不应：UI 显示、业务逻辑

export const EQUIPMENT_SLOTS = 7;   // 装备槽上限
export const BACKPACK_LIMIT = 10;   // 背包上限

class GameState {
    constructor() {
        if (GameState._instance) {
            return GameState._instance;
        }
        GameState._instance = this;

        this.player = {
            name: '玩家',
            texture: 'Ki-61',
            level: 1,
            hp: 500,
            maxHp: 500,
            defense: 0,
            gold: 0,
            shield: 0,
        };

        this.inventory = {
            equipment: [],     // 已装备的装备（最多 EQUIPMENT_SLOTS）
            items: [],         // 背包道具（最多 BACKPACK_LIMIT）
        };

        this.shopItems = [];   // 商店商品列表，每个 { id, sold }

        this.enemy = {
            name: '敌人',
            texture: 'N1K-J',
            level: 1,
            hp: 500,
            maxHp: 500,
            defense: 0,
            equipment: [],     // 敌人装备（最多 EQUIPMENT_SLOTS）
            shield: 0,
        };

        // ========== 关卡进度 ==========
        // currentStage  - 当前游玩到第几关
        // maxStage      - 已解锁的最大关卡
        // stageRun      - 当前关卡的运行态（加载后填充），包含：
        //   stageId      关卡 ID
        //   currentNode  当前节点在 nodes 中的索引
        //   nodes[]      运行时节点列表（battle 节点已挂载 enemy 实例）
        this.progress = {
            currentStage: 1,
            maxStage: 1,
            totalKills: 0,
        };
        this.stageRun = null;

        this.battle = null;
    }

    reset() {
        this.player = {
            name: '玩家',
            texture: 'Ki-61',
            level: 1,
            hp: 500,
            maxHp: 500,
            defense: 0,
            gold: 0,
            shield: 0,
        };
        this.inventory = { equipment: [], items: [] };
        this.shopItems = [];
        this.enemy = {
            name: '敌人',
            texture: 'N1K-J',
            level: 1,
            hp: 500,
            maxHp: 500,
            defense: 0,
            equipment: [],
            shield: 0,
        };
        this.progress = { currentStage: 1, maxStage: 1, totalKills: 0 };
        this.stageRun = null;
        this.battle = null;
    }
}

const gameState = new GameState();
export default gameState;