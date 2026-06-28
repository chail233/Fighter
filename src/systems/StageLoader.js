// StageLoader - 关卡加载器
// 职责：将关卡配置（静态模板）实例化为运行时状态
// 不应：UI 显示

import gameState from '../GameState.js';
import { createEquipment, EQUIPMENT_CONFIGS } from '../data/equipmentConfig.js';
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

        // 深拷贝节点列表，battle 节点保存原始 ID + 首次创建 Equipment 实例
        const nodes = config.nodes.map(node => {
            const n = { ...node };
            if (n.type === 'battle') {
                // 保存原始装备 ID 数组，用于每次 prepareBattle 时重建
                n._equipmentIds = [...(n.enemy.equipment || [])];
                const eqInstances = n._equipmentIds.map(id => createEquipment(id)).filter(Boolean);
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

        // 随机刷新商店：从全量装备池取 3 件
        this._refreshShop(3);

        return true;
    }

    /**
     * 随机刷新商店商品
     * @param {number} count - 商品数量
     */
    _refreshShop(count) {
        const allIds = Object.keys(EQUIPMENT_CONFIGS);
        // Fisher-Yates 洗牌取前 count 个
        const shuffled = [...allIds];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        gameState.shopItems = shuffled.slice(0, count).map(id => ({ id, sold: false }));
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

        // 重置玩家防护值
        gameState.player.shield = 0;
        gameState.player.maxShield = 0;

        // 重置所有玩家装备（从 ID 重建，清除上个战斗累积的 value/cooldownTimer）
        const playerEqIds = gameState.inventory.equipment.map(eq => eq.id);
        gameState.inventory.equipment = playerEqIds.map(id => createEquipment(id)).filter(Boolean);

        const backpackIds = gameState.inventory.items.map(eq => eq.id);
        gameState.inventory.items = backpackIds.map(id => createEquipment(id)).filter(Boolean);

        // 从节点原始 ID 重建敌人装备（避免上一场战斗累积的数据残留）
        const { enemy } = node;
        gameState.enemy.name = enemy.name;
        gameState.enemy.texture = enemy.texture;
        gameState.enemy.hp = enemy.hp;
        gameState.enemy.maxHp = enemy.maxHp;
        gameState.enemy.defense = enemy.defense;
        gameState.enemy.shield = enemy.shield || 0;
        gameState.enemy.maxShield = enemy.maxShield || 0;
        gameState.enemy.equipment = (node._equipmentIds || []).map(id => createEquipment(id)).filter(Boolean);

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
     * 重置所有玩家装备为初始状态（从 ID 重建，清除战斗累积数据）
     */
    resetEquipment() {
        const playerEqIds = gameState.inventory.equipment.map(eq => eq.id);
        gameState.inventory.equipment = playerEqIds.map(id => createEquipment(id)).filter(Boolean);

        const backpackIds = gameState.inventory.items.map(eq => eq.id);
        gameState.inventory.items = backpackIds.map(id => createEquipment(id)).filter(Boolean);

        const enemyEqIds = gameState.enemy.equipment.map(eq => eq.id);
        gameState.enemy.equipment = enemyEqIds.map(id => createEquipment(id)).filter(Boolean);
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