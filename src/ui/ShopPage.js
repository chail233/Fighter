// ShopPage - 商店页面 UI
// 职责：构建购买区 + 出售区的显示和交互
// 不应：修改游戏数据

import gameState from '../GameState.js';
import gameManager from '../GameManager.js';
import { MenuButton } from './MenuButton.js';
import { MenuSlot } from './MenuSlot.js';

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

            const statusText = scene.add.text(720, y + 28, '', {
                fontSize: '18px', fontFamily: 'Arial', color: '#888888',
            });
            container.add(statusText);

            const buyBtn = new MenuButton(scene, 920, y + 30, 130, 40, '购买', () => {
                gameManager.buyEquipment(item.id);
                this.refresh();
            }, {}, container);

            this.shopItemObjects.push({ bg, nameText, descText, statusText, buyBtn, id: item.id, price: item.price });
        });

        // 出售区标题
        const sellTitle = scene.add.text(640, 360, '出售装备', {
            fontSize: '20px', fontFamily: 'Arial', color: '#ffffff',
        }).setOrigin(0.5);
        container.add(sellTitle);

        this.sellSlots = [];

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

        // 刷新出售区
        for (const slot of this.sellSlots) {
            slot.destroy();
        }
        this.sellSlots = [];

        const slotSize = 60;
        const gap = 8;
        const count = Math.min(gameState.inventory.items.length, 10);
        if (count === 0) return;

        const totalWidth = count * slotSize + (count - 1) * gap;
        const startX = (1280 - totalWidth) / 2;

        for (let i = 0; i < count; i++) {
            const x = startX + i * (slotSize + gap);
            const slot = new MenuSlot(this.scene, x, 390, slotSize, (idx) => {
                gameManager.sellEquipment(idx);
                this.refresh();
            }, i, this.container);
            slot.setEquipment(gameState.inventory.items[i]);
            this.sellSlots.push(slot);
        }
    }
}