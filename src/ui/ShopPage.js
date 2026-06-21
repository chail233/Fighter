// ShopPage - 商店页面 UI
// 职责：构建购买区 + 出售区的显示和交互
// 不应：修改游戏数据

import gameState from '../GameState.js';
import gameManager from '../GameManager.js';
import { MenuButton } from './MenuButton.js';
import { MenuSlot } from './MenuSlot.js';
import { Tooltip } from './Tooltip.js';
import { EQUIPMENT_CONFIGS } from '../data/equipmentConfig.js';

export class ShopPage {
    constructor(scene, container) {
        this.scene = scene;
        this.container = container;
        this.tooltip = new Tooltip(scene);

        const title = scene.add.text(640, 30, '商店', {
            fontSize: '28px', fontFamily: 'Arial', color: '#ffffff',
        }).setOrigin(0.5);
        container.add(title);

        this.goldText = scene.add.text(640, 70, '', {
            fontSize: '18px', fontFamily: 'Arial', color: '#ffdd44',
        }).setOrigin(0.5);
        container.add(this.goldText);

        // 购买区标题
        const buyTitle = scene.add.text(640, 110, '购买装备', {
            fontSize: '16px', fontFamily: 'Arial', color: '#aaaaaa',
        }).setOrigin(0.5);
        container.add(buyTitle);

        // 商店物品格子
        this.shopSlots = [];

        const itemIds = ['97-gun', '89-gun', '3year-gun', '1st-gun', '99-cannon', '99-cannon-2', 'ho-155', '5-cannon', '89-revolving-gun'];

        itemIds.forEach((id, i) => {
            const config = EQUIPMENT_CONFIGS[id];
            if (!config) return;

            const slotSize = 70;
            const gap = 16;
            const totalW = itemIds.length * slotSize + (itemIds.length - 1) * gap;
            const x = (1280 - totalW) / 2 + i * (slotSize + gap);
            const y = 140;

            const slot = new MenuSlot(scene, x, y, slotSize, () => {
                gameManager.buyEquipment(id);
                this.refresh();
            }, 0, container, this.tooltip);

            // 价格文字（格子下方）
            const priceText = scene.add.text(x + slotSize / 2, y + slotSize + 8, `${config.price} G`, {
                fontSize: '15px', fontFamily: 'Arial', color: '#ffdd44',
            }).setOrigin(0.5);
            container.add(priceText);

            this.shopSlots.push({ slot, id, price: config.price, priceText });
        });

        // 出售区标题
        const sellTitle = scene.add.text(640, 280, '出售装备', {
            fontSize: '16px', fontFamily: 'Arial', color: '#aaaaaa',
        }).setOrigin(0.5);
        container.add(sellTitle);

        this.sellSlots = [];

        this.refresh();
    }

    refresh() {
        this.tooltip.hide();

        if (this.goldText) {
            this.goldText.setText(`金币: ${gameState.player.gold}`);
        }

        // 刷新购买区商品状态
        for (const { slot, id, priceText } of this.shopSlots) {
            const shopItem = gameState.shopItems.find(s => s.id === id);
            const sold = shopItem ? shopItem.sold : true;

            if (sold) {
                slot.setEquipment(null);
                slot.label.setText('已售罄');
                slot.label.setColor('#888888');
                slot.hitArea.disableInteractive();
                priceText.setVisible(false);
            } else {
                const config = EQUIPMENT_CONFIGS[id];
                if (config) {
                    const displayEq = { name: config.name, category: config.category, description: config.description, value: config.value, cooldown: config.cooldown };
                    slot.setEquipment(displayEq);
                }
                slot.hitArea.setInteractive({ useHandCursor: true });
                priceText.setVisible(true);
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
            const slot = new MenuSlot(this.scene, x, 310, slotSize, (idx) => {
                gameManager.sellEquipment(idx);
                this.refresh();
            }, i, this.container, this.tooltip);
            slot.setEquipment(gameState.inventory.items[i]);
            this.sellSlots.push(slot);
        }
    }
}