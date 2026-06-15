// GameState - 全局状态单例
// 职责：存储玩家和游戏运行时信息
// 不应：UI 显示、业务逻辑

class GameState {
    constructor() {
        if (GameState._instance) {
            return GameState._instance;
        }
        GameState._instance = this;

        this.player = {
            name: '玩家',
            level: 1,
            hp: 100,
            maxHp: 100,
            attack: 10,
            defense: 5,
            gold: 0,
        };

        this.inventory = {
            equipment: [],     // 已装备的装备
            items: [],         // 背包道具
        };
    }

    reset() {
        this.player = {
            name: '玩家',
            level: 1,
            hp: 100,
            maxHp: 100,
            attack: 10,
            defense: 5,
            gold: 0,
        };
        this.inventory = { equipment: [], items: [] };
        this.progress = { currentStage: 1, maxStage: 1, totalKills: 0 };
        this.battle = null;
    }
}

const gameState = new GameState();
export default gameState;