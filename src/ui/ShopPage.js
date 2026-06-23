// ShopPage - 商店页面 UI
// 职责：构建购买区 + 出售区的显示和交互
// 不应：修改游戏数据

import gameState from '../GameState.js';
import gameManager from '../GameManager.js';
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

        const buyTitle = scene.add.text(640, 110, '购买装备', {
            fontSize: '16px', fontFamily: 'Arial', color: '#aaaaaa',
        }).setOrigin(0.5);
        container.add(buyTitle);

        this.buyAreaY = 140;
        this.shopSlots = [];

        // 出售区标题
        const sellTitle = scene.add.text(640, 310, '出售装备', {
            fontSize: '16px', fontFamily: 'Arial', color: '#aaaaaa',
        }).setOrigin(0.5);
        container.add(sellTitle);

        this.sellSlots = [];
        this.sellAreaY = 340;

        this.refresh();
    }

    refresh() {
        this.tooltip.hide();

        // 金币
        if (this.goldText) {
            this.goldText.setText(`金币: ${gameState.player.gold}`);
        }

        // === 购买区 ===
        // 清除旧的购买槽
        for (const { slot, priceText } of this.shopSlots) {
            slot.destroy();
            priceText.destroy();
        }
        this.shopSlots = [];

        const itemIds = gameState.shopItems.map(s => s.id);
        const slotSize = 70;
        const gap = 16;
        const maxCols = itemIds.length < 5 ? itemIds.length : 5;

        if (maxCols > 0) {
            itemIds.forEach((id, i) => {
                const config = EQUIPMENT_CONFIGS[id];
                if (!config) return;

                const col = i % maxCols;
                const row = Math.floor(i / maxCols);
                const totalRowW = maxCols * slotSize + (maxCols - 1) * gap;
                const x = (1280 - totalRowW) / 2 + col * (slotSize + gap);
                const y = this.buyAreaY + row * (slotSize + 30);

                const slot = new MenuSlot(this.scene, x, y, slotSize, () => {
                    gameManager.buyEquipment(id);
                    this.refresh();
                }, 0, this.container, this.tooltip);

                const priceText = this.scene.add.text(x + slotSize / 2, y + slotSize + 8, `${config.price} G`, {
                    fontSize: '15px', fontFamily: 'Arial', color: '#ffdd44',
                }).setOrigin(0.5);
                this.container.add(priceText);

                this.shopSlots.push({ slot, id, price: config.price, priceText });
            });
        }

        // 刷新购买区商品售罄状态
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

        // === 出售区 ===
        for (const slot of this.sellSlots) {
            slot.destroy();
        }
        this.sellSlots = [];

        const sellSlotSize = 60;
        const sellGap = 8;
        const count = Math.min(gameState.inventory.items.length, 10);
        if (count === 0) return;

        const totalWidth = count * sellSlotSize + (count - 1) * sellGap;
        const startX = (1280 - totalWidth) / 2;

        for (let i = 0; i < count; i++) {
            const x = startX + i * (sellSlotSize + sellGap);
            const slot = new MenuSlot(this.scene, x, this.sellAreaY, sellSlotSize, (idx) => {
                gameManager.sellEquipment(idx);
                this.refresh();
            }, i, this.container, this.tooltip);
            slot.setEquipment(gameState.inventory.items[i]);
            this.sellSlots.push(slot);
        }
    }
}