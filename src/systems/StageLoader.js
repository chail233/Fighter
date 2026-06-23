// StageLoader - 关卡加载器
// 职责：将关卡配置（静态模板）实例化为运行时状态
// 不应：UI 显示

import gameState from '../GameState.js';
import { createEquipment } from '../data/equipmentConfig.js';
import { getStageById } from '../data/stageConfig.js';

class StageLoader {
    /**
     * 加载指定关卡的运行时数据
     * @param {number} stageId - 关卡 ID
     * @returns {boolean} 是否加载成功
     */
    loadStage(stageId) {
        const config = getStageById(stageId);
        if (!config) return false;

        // 深拷贝节点列表，battle 节点中的 equipment ID 转 Equipment 实例
        const nodes = config.nodes.map(node => {
            const n = { ...node };
            if (n.type === 'battle') {
                // 敌人装备：ID → Equipment 实例
                const eqInstances = (n.enemy.equipment || []).map(id => createEquipment(id)).filter(Boolean);
                n.enemy = { ...n.enemy, equipment: eqInstances };
                n.rewards = { ...n.rewards };
            }
            return n;
        });

        // 写入运行态
        gameState.stageRun = {
            stageId: config.id,
            currentNode: 0,
            nodes,
        };

        // 更新进度（保证 currentStage 与加载的一致）
        gameState.progress.currentStage = stageId;

        return true;
    }

    /**
     * 获取当前节点
     * @returns {object|null}
     */
    getCurrentNode() {
        const run = gameState.stageRun;
        if (!run || run.currentNode >= run.nodes.length) return null;
        return run.nodes[run.currentNode];
    }

    /**
     * 前进到下一节点（不越过关卡末尾）
     * @returns {object|null} 下一个节点，或 null 表示关卡结束
     */
    advance() {
        const run = gameState.stageRun;
        if (!run) return null;

        run.currentNode++;
        return this.getCurrentNode();
    }

    /**
     * 进入战斗节点前的准备：
     * 1. 回满玩家血量
     * 2. 将敌人的运行时数据写入 gameState.enemy
     */
    prepareBattle() {
        const node = this.getCurrentNode();
        if (!node || node.type !== 'battle') return false;

        // 回满玩家血量
        gameState.player.hp = gameState.player.maxHp;

        // 拷贝敌人数据到 gameState.enemy
        const { enemy } = node;
        gameState.enemy.name = enemy.name;
        gameState.enemy.texture = enemy.texture;
        gameState.enemy.hp = enemy.hp;
        gameState.enemy.maxHp = enemy.maxHp;
        gameState.enemy.defense = enemy.defense;
        gameState.enemy.equipment = enemy.equipment;

        return true;
    }

    /**
     * 战斗胜利后处理奖励
     * @returns {{ gold: number, items: string[] }}
     */
    collectRewards() {
        const node = this.getCurrentNode();
        if (!node || node.type !== 'battle') return { gold: 0, items: [] };

        const rewards = node.rewards || { gold: 0, items: [] };

        // 发放金币
        if (rewards.gold > 0) {
            gameState.player.gold += rewards.gold;
        }

        // 发放掉落装备（放入背包）
        const droppedItems = [];
        if (rewards.items && rewards.items.length > 0) {
            for (const id of rewards.items) {
                const eq = createEquipment(id);
                if (eq) {
                    // 背包有空位则放入
                    if (gameState.inventory.items.length < 10) {
                        gameState.inventory.items.push(eq);
                        droppedItems.push(id);
                    }
                }
            }
        }

        return { gold: rewards.gold || 0, items: droppedItems };
    }

    /**
     * 当前关卡是否还有剩余节点
     */
    hasNext() {
        const run = gameState.stageRun;
        if (!run) return false;
        return run.currentNode < run.nodes.length - 1;
    }

    /**
     * 当前关卡是否全部完成
     */
    isComplete() {
        const run = gameState.stageRun;
        if (!run) return false;
        return run.currentNode >= run.nodes.length;
    }
}

export const stageLoader = new StageLoader();