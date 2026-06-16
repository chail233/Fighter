// ShopPage - 商店页面 UI
// 职责：构建购买区 + 出售区的显示和交互
// 不应：修改游戏数据

import gameState from '../GameState.js';
import gameManager from '../GameManager.js';
import { MenuButton } from './MenuButton.js';

export class ShopPage {
    constructor(scene, container) {
        this.scene = scene;
        this.container = container;

        const title = scene.add.text(640, 30, '商店', {
            fontSize: '28px', fontFamily: 'Arial', color: '#ffffff',
        }).setOrigin(0.5);
        container.add(title);

        this.goldText = scene.add.text(640, 70, '', {
            fontSize: '18px', fontFamily: 'Arial', color: '#ffdd44',
        }).setOrigin(0.5);
        container.add(this.goldText);

        // 购买区 - 机枪
        const y = 140;
        const bg = scene.add.graphics();
        bg.fillStyle(0x222244, 0.8);
        bg.fillRoundedRect(340, y, 600, 80, 8);
        container.add(bg);

        const nameText = scene.add.text(360, y + 10, '机枪', {
            fontSize: '18px', fontFamily: 'Arial', color: '#ffffff',
        });
        container.add(nameText);

        const descText = scene.add.text(360, y + 40, '快速射击，强度递增', {
            fontSize: '13px', fontFamily: 'Arial', color: '#aaaaaa',
        });
        container.add(descText);

        const priceText = scene.add.text(740, y + 20, '50 G', {
            fontSize: '16px', fontFamily: 'Arial', color: '#ffdd44',
        });
        container.add(priceText);

        new MenuButton(scene, 820, y + 20, 100, 40, '购买', () => {
            gameManager.buyEquipment('gun');
            this.refresh();
        }, {}, container);

        // 出售提示
        const sellLabel = scene.add.text(640, 420, '出售装备（点击背包中的装备出售）', {
            fontSize: '16px', fontFamily: 'Arial', color: '#aaaaaa',
        }).setOrigin(0.5);
        container.add(sellLabel);

        this.refresh();
    }

    refresh() {
        if (this.goldText) {
            this.goldText.setText(`金币: ${gameState.player.gold}`);
        }
    }
}