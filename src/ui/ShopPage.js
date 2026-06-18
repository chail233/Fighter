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

        // 商店物品列表
        const items = [
            { id: 'gun', name: '机枪', price: 50, desc: '快速射击，强度递增' },
        ];

        this.shopItemObjects = [];

        items.forEach((item, i) => {
            const y = 140 + i * 110;
            const bg = scene.add.graphics();
            bg.fillStyle(0x222244, 0.8);
            bg.fillRoundedRect(200, y, 880, 90, 8);
            container.add(bg);

            const nameText = scene.add.text(220, y + 10, item.name, {
                fontSize: '20px', fontFamily: 'Arial', color: '#ffffff',
            });
            container.add(nameText);

            const descText = scene.add.text(220, y + 42, item.desc, {
                fontSize: '14px', fontFamily: 'Arial', color: '#aaaaaa',
            });
            container.add(descText);

            // 状态文字（左侧显示已售 / 价格）
            const statusText = scene.add.text(720, y + 28, '', {
                fontSize: '18px', fontFamily: 'Arial', color: '#888888',
            });
            container.add(statusText);

            // 购买按钮（最右）
            const buyBtn = new MenuButton(scene, 920, y + 30, 130, 40, '购买', () => {
                gameManager.buyEquipment(item.id);
                this.refresh();
            }, {}, container);

            this.shopItemObjects.push({ bg, nameText, descText, statusText, buyBtn, id: item.id, price: item.price });
        });

        // 出售提示
        const sellLabel = scene.add.text(640, 430, '出售装备（点击背包中的装备出售）', {
            fontSize: '16px', fontFamily: 'Arial', color: '#aaaaaa',
        }).setOrigin(0.5);
        container.add(sellLabel);

        this.refresh();
    }

    refresh() {
        if (this.goldText) {
            this.goldText.setText(`金币: ${gameState.player.gold}`);
        }

        // 刷新商品显示状态
        for (const obj of this.shopItemObjects) {
            const shopItem = gameState.shopItems.find(s => s.id === obj.id);
            const sold = shopItem ? shopItem.sold : true;

            if (sold) {
                obj.statusText.setText('已售罄');
                obj.statusText.setColor('#888888');
                obj.buyBtn.hitArea.disableInteractive();
                obj.buyBtn.label.setColor('#666666');
                obj.buyBtn.bg.clear();
                obj.buyBtn.bg.fillStyle(0x333333, 1);
                obj.buyBtn.bg.fillRoundedRect(
                    obj.buyBtn.hitArea.x - 65,
                    obj.buyBtn.hitArea.y - 20,
                    130, 40, 8
                );
            } else {
                obj.statusText.setText(`${obj.price} G`);
                obj.statusText.setColor('#ffdd44');
                obj.buyBtn.hitArea.setInteractive({ useHandCursor: true });
                obj.buyBtn.label.setColor('#ffffff');
                obj.buyBtn.bg.clear();
                obj.buyBtn.bg.fillStyle(0x334488, 1);
                obj.buyBtn.bg.fillRoundedRect(
                    obj.buyBtn.hitArea.x - 65,
                    obj.buyBtn.hitArea.y - 20,
                    130, 40, 8
                );
            }
        }
    }
}