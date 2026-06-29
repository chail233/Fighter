// BattleHud - 战斗 HUD 顶层组件
// 职责：整合血条、防护值条、装备面板等战斗 UI
// 不应：修改游戏规则

import { HpBar } from './HpBar.js';
import { ShieldBar } from './ShieldBar.js';
import { EquipmentPanel } from './EquipmentPanel.js';
import { Tooltip } from './Tooltip.js';

export class BattleHud {
    /**
     * @param {Phaser.Scene} scene
     */
    constructor(scene) {
        this.scene = scene;
        this.tooltip = new Tooltip(scene);

        // 玩家 HUD（正下方居中）
        this.playerEquipPanel = new EquipmentPanel(scene, 465, 635, 44, this.tooltip);
        this.playerHpBar = new HpBar(scene, 490, 702, 300, 18, 100);
        this.playerShieldBar = new ShieldBar(scene, 490, 684, 300, 14);

        // 敌人 HUD（正上方居中）
        this.enemyEquipPanel = new EquipmentPanel(scene, 465, 12, 44, this.tooltip);
        this.enemyHpBar = new HpBar(scene, 490, 78, 300, 18, 100);
        this.enemyShieldBar = new ShieldBar(scene, 490, 60, 300, 14);
    }

    /**
     * 绑定玩家数据
     * @param {object} player - gameState.player
     * @param {object} inventory - gameState.inventory
     */
    bindPlayer(player, inventory) {
        this.playerHpBar.update(player.hp, player.maxHp);
        this.playerShieldBar.update(player.shield);
        this.playerEquipPanel.bindEquipment(inventory.equipment);
    }

    /**
     * 绑定敌人数据
     * @param {object} enemy - gameState.enemy
     */
    bindEnemy(enemy) {
        this.enemyHpBar.update(enemy.hp, enemy.maxHp);
        this.enemyShieldBar.update(enemy.shield);
        this.enemyEquipPanel.bindEquipment(enemy.equipment);
    }

    /**
     * 刷新所有 UI（每帧调用）
     * @param {object} player
     * @param {object} enemy
     */
    update(player, enemy) {
        this.playerHpBar.update(player.hp, player.maxHp);
        this.playerShieldBar.update(player.shield);
        this.enemyHpBar.update(enemy.hp, enemy.maxHp);
        this.enemyShieldBar.update(enemy.shield);
        this.playerEquipPanel.update();
        this.enemyEquipPanel.update();
    }

    destroy() {
        this.playerHpBar.destroy();
        this.playerShieldBar.destroy();
        this.playerEquipPanel.destroy();
        this.enemyHpBar.destroy();
        this.enemyShieldBar.destroy();
        this.enemyEquipPanel.destroy();
        this.tooltip.destroy();
    }
}