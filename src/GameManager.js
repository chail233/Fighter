// GameManager - 全局游戏逻辑调度单例
// 职责：处理和管理各种游戏逻辑
// 不应：存储游戏数据、显示 UI

import gameState from './GameState.js';

class GameManager {
    constructor() {
        if (GameManager._instance) {
            return GameManager._instance;
        }
        GameManager._instance = this;
    }
}

const gameManager = new GameManager();
export default gameManager;