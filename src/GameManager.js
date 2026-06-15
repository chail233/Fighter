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

    /** 主更新循环，由场景每帧调用 */
    update(delta) {
        // 后续填充战斗逻辑
    }
}

const gameManager = new GameManager();
export default gameManager;