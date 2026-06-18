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
            hp: 100,
            maxHp: 100,
            defense: 0,
            gold: 0,
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
            hp: 50,
            maxHp: 50,
            defense: 0,
            equipment: [],     // 敌人装备（最多 EQUIPMENT_SLOTS）
        };

        this.progress = {
            currentStage: 1,
            maxStage: 1,
            totalKills: 0,
        };

        this.battle = null;
    }

    reset() {
        this.player = {
            name: '玩家',
            texture: 'Ki-61',
            level: 1,
            hp: 100,
            maxHp: 100,
            defense: 0,
            gold: 0,
        };
        this.inventory = { equipment: [], items: [] };
        this.shopItems = [];
        this.enemy = {
            name: '敌人',
            texture: 'N1K-J',
            level: 1,
            hp: 50,
            maxHp: 50,
            defense: 0,
            equipment: [],
        };
        this.progress = { currentStage: 1, maxStage: 1, totalKills: 0 };
        this.battle = null;
    }
}

const gameState = new GameState();
export default gameState;