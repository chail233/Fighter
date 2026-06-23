// StagePage - 节点/关卡推进页面 UI
// 职责：显示当前节点内容，提供战斗/推进入口
// 不应：修改游戏数据

import gameState from '../GameState.js';
import gameManager from '../GameManager.js';
import { MenuButton } from './MenuButton.js';
import { STAGES } from '../data/stageConfig.js';

export class StagePage {
    constructor(scene, container) {
        this.scene = scene;
        this.container = container;

        // 关卡名
        this.stageTitle = scene.add.text(640, 30, '', {
            fontSize: '26px', fontFamily: 'Arial', color: '#ffffff',
        }).setOrigin(0.5);
        container.add(this.stageTitle);

        // 节点描述框（带半透明背景）
        const textBg = scene.add.graphics();
        textBg.fillStyle(0x000000, 0.5);
        textBg.fillRoundedRect(140, 80, 1000, 480, 12);
        container.add(textBg);

        // 节点文本
        this.nodeText = scene.add.text(640, 200, '', {
            fontSize: '17px', fontFamily: 'Arial', color: '#ffffff',
            wordWrap: { width: 900 }, lineSpacing: 8,
        }).setOrigin(0.5, 0);
        container.add(this.nodeText);

        // 奖励预览
        this.rewardText = scene.add.text(640, 520, '', {
            fontSize: '15px', fontFamily: 'Arial', color: '#ffdd44',
        }).setOrigin(0.5);
        container.add(this.rewardText);

        // 按钮容器
        this.actionButton = null;

        // 关卡切换提示（仅在关卡结束时显示）
        this.nextStageText = scene.add.text(640, 570, '', {
            fontSize: '14px', fontFamily: 'Arial', color: '#88aaff',
        }).setOrigin(0.5);
        container.add(this.nextStageText);

        // 返回菜单按钮（只在关卡结束时显示）
        this.menuBtn = null;

        this.refresh();
    }

    refresh() {
        // 清除旧的 action 按钮
        if (this.actionButton) {
            this.actionButton.destroy();
            this.actionButton = null;
        }
        if (this.menuBtn) {
            this.menuBtn.destroy();
            this.menuBtn = null;
        }

        const stageRun = gameState.stageRun;
        if (!stageRun) {
            // 尚未初始化关卡
            this.stageTitle.setText('无活动关卡');
            this.nodeText.setText('请初始化游戏。');
            this.rewardText.setText('');
            this.nextStageText.setText('');

            this.actionButton = new MenuButton(this.scene, 640, 600, 200, 50, '开始游戏', () => {
                const maxStage = gameState.progress.maxStage;
                gameManager.loadStage(maxStage);
                this.refresh();
            }, {}, this.container);
            return;
        }

        const stageConfig = STAGES.find(s => s.id === stageRun.stageId);
        this.stageTitle.setText(stageConfig ? stageConfig.name : `第 ${stageRun.stageId} 关`);

        const node = gameManager.getCurrentNode();

        // 关卡已完成
        if (!node) {
            this.nodeText.setText('本关已完成！\n\n你可以继续挑战下一关。');
            this.rewardText.setText('');
            this.nextStageText.setText('');

            // 解锁下一关
            const nextId = stageRun.stageId + 1;
            const nextConfig = STAGES.find(s => s.id === nextId);
            if (nextConfig) {
                if (gameState.progress.maxStage < nextId) {
                    gameState.progress.maxStage = nextId;
                }
                this.nextStageText.setText(`下一关：${nextConfig.name}`);

                this.actionButton = new MenuButton(this.scene, 640, 600, 200, 50, '下一关', () => {
                    gameManager.loadStage(nextId);
                    this.refresh();
                }, {}, this.container);
            } else {
                this.nextStageText.setText('恭喜！你已经通关全部关卡！');
                this.actionButton = new MenuButton(this.scene, 640, 600, 200, 50, '重新开始', () => {
                    gameManager.initNewGame();
                    gameManager.loadStage(1);
                    this.refresh();
                }, {}, this.container);
            }
            return;
        }

        // 显示节点内容
        if (node.type === 'story') {
            this.nodeText.setText(node.text);
            this.rewardText.setText('');
            this.nextStageText.setText(`节点 ${stageRun.currentNode + 1} / ${stageRun.nodes.length} · 剧情`);

            this.actionButton = new MenuButton(this.scene, 640, 580, 200, 50, '继续 →', () => {
                gameManager.advanceNode();
                this.refresh();
            }, {}, this.container);

        } else if (node.type === 'battle') {
            const desc = node.text || '迎战！';
            this.nodeText.setText(desc + '\n\n' +
                `敌机：${node.enemy.name}\n` +
                `生命：${node.enemy.hp}  ·  防御：${node.enemy.defense}\n` +
                `装备：${(node.enemy.equipment || []).join(', ') || '无'}`);
            this.nextStageText.setText(`节点 ${stageRun.currentNode + 1} / ${stageRun.nodes.length} · 战斗`);

            // 显示奖励预览
            const rewards = node.rewards || {};
            const rewardParts = [];
            if (rewards.gold) rewardParts.push(`${rewards.gold} G`);
            if (rewards.items && rewards.items.length > 0) {
                rewardParts.push(`掉落：${rewards.items.join(', ')}`);
            }
            this.rewardText.setText(rewardParts.length > 0 ? '奖励：' + rewardParts.join(' | ') : '');

            this.actionButton = new MenuButton(this.scene, 640, 600, 200, 60, '⚔ 进入战斗', () => {
                gameManager.prepareBattle();
                this.scene.scene.start('BattleScene');
            }, {}, this.container);
        }
    }

    destroy() {
        if (this.actionButton) this.actionButton.destroy();
        if (this.menuBtn) this.menuBtn.destroy();
    }
}