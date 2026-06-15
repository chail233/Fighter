// BattleHud - 战斗 HUD 顶层组件
// 职责：整合血条、装备面板等战斗 UI
// 不应：修改游戏规则

import { HpBar } from './HpBar.js';
import { EquipmentPanel } from './EquipmentPanel.js';

export class BattleHud {
    /**
     * @param {Phaser.Scene} scene
     */
    constructor(scene) {
        this.scene = scene;

        // 玩家 HUD（正下方居中）
        this.playerEquipPanel = new EquipmentPanel(scene, 465, 640, 44);
        this.playerHpBar = new HpBar(scene, 490, 690, 300, 22, 100);

        // 敌人 HUD（正上方居中）
        this.enemyEquipPanel = new EquipmentPanel(scene, 465, 12, 44);
        this.enemyHpBar = new HpBar(scene, 490, 62, 300, 22, 100);
    }

    /**
     * 绑定玩家数据
     * @param {object} player - gameState.player
     * @param {object} inventory - gameState.inventory
     */
    bindPlayer(player, inventory) {
        this.playerHpBar.update(player.hp, player.maxHp);
        this.playerEquipPanel.bindEquipment(inventory.equipment);
    }

    /**
     * 绑定敌人数据
     * @param {object} enemy - gameState.enemy
     */
    bindEnemy(enemy) {
        this.enemyHpBar.update(enemy.hp, enemy.maxHp);
        this.enemyEquipPanel.bindEquipment(enemy.equipment);
    }

    /**
     * 刷新所有 UI（每帧调用）
     * @param {object} player
     * @param {object} enemy
     */
    update(player, enemy) {
        this.playerHpBar.update(player.hp, player.maxHp);
        this.enemyHpBar.update(enemy.hp, enemy.maxHp);
        this.playerEquipPanel.update();
        this.enemyEquipPanel.update();
    }

    destroy() {
        this.playerHpBar.destroy();
        this.playerEquipPanel.destroy();
        this.enemyHpBar.destroy();
        this.enemyEquipPanel.destroy();
    }
}