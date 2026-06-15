import gameState, { EQUIPMENT_SLOTS } from '../GameState.js';
import gameManager from '../GameManager.js';
import { MenuSlot } from '../ui/MenuSlot.js';
import { MenuButton } from '../ui/MenuButton.js';
import { PageNavigator } from '../ui/PageNavigator.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        this.currentPage = 0;
        this.totalPages = 3;
        this.pageContainer = [];

        for (let i = 0; i < this.totalPages; i++) {
            const container = this.add.container(0, 0);
            container.setVisible(i === 0);
            this.pageContainer.push(container);
        }

        this.buildEquipPage(this.pageContainer[0]);
        this.buildShopPage(this.pageContainer[1]);
        this.buildDeployPage(this.pageContainer[2]);

        this.navigator = new PageNavigator(this, this.totalPages, (page) => {
            this.pageContainer[this.currentPage].setVisible(false);
            this.currentPage = page;
            this.pageContainer[page].setVisible(true);
            if (page === 1) this.refreshShopPage();
        });
    }

    // ========== 装备管理页 ==========

    buildEquipPage(container) {
        this.addTitle(container, '装备管理');
        this.addLabel(container, '已装备', 80);
        this.addLabel(container, '背包', 210);

        // 7 个装备槽
        this.equipSlots = [];
        const slotSize = 70;
        const gap = 10;
        const totalWidth = EQUIPMENT_SLOTS * slotSize + (EQUIPMENT_SLOTS - 1) * gap;
        const startX = (1280 - totalWidth) / 2;

        for (let i = 0; i < EQUIPMENT_SLOTS; i++) {
            const x = startX + i * (slotSize + gap);
            const slot = new MenuSlot(this, x, 110, slotSize, (idx) => {
                this.onEquipSlotClick(idx);
            }, i, container);
            this.equipSlots.push(slot);
        }

        // 背包槽（动态创建）
        this.backpackSlots = [];
        this.refreshEquipPage();

        this.addTip(container, '← 点击屏幕边缘切换页面 | 点击装备可交换位置');
    }

    // ========== 商店页 ==========

    buildShopPage(container) {
        this.addTitle(container, '商店');

        this.goldText = this.add.text(640, 70, '', {
            fontSize: '18px', fontFamily: 'Arial', color: '#ffdd44',
        }).setOrigin(0.5);
        container.add(this.goldText);

        // 购买区
        const shopItems = [
            { id: 'gun', name: '机枪', price: 50, desc: '快速射击，强度递增' },
        ];

        shopItems.forEach((item, i) => {
            const y = 140 + i * 100;
            const bg = this.add.graphics();
            bg.fillStyle(0x222244, 0.8);
            bg.fillRoundedRect(340, y, 600, 80, 8);
            container.add(bg);

            const nameText = this.add.text(360, y + 10, item.name, {
                fontSize: '18px', fontFamily: 'Arial', color: '#ffffff',
            });
            container.add(nameText);

            const descText = this.add.text(360, y + 40, item.desc, {
                fontSize: '13px', fontFamily: 'Arial', color: '#aaaaaa',
            });
            container.add(descText);

            const priceText = this.add.text(740, y + 20, `${item.price} G`, {
                fontSize: '16px', fontFamily: 'Arial', color: '#ffdd44',
            });
            container.add(priceText);

            new MenuButton(this, 820, y + 20, 100, 40, '购买', () => {
                this.buyItem(item.id);
            }, {}, container);
        });

        // 出售区
        this.addLabel(container, '出售装备（点击背包中的装备出售）', 420);
        this.sellBackpackSlots = [];

        this.addTip(container, '');
    }

    // ========== 出击页 ==========

    buildDeployPage(container) {
        const title = this.add.text(640, 200, '准备出击', {
            fontSize: '36px', fontFamily: 'Arial', color: '#ffffff',
        }).setOrigin(0.5);
        container.add(title);

        const subtitle = this.add.text(640, 250, '检查你的装备，准备迎战！', {
            fontSize: '18px', fontFamily: 'Arial', color: '#888888',
        }).setOrigin(0.5);
        container.add(subtitle);

        new MenuButton(this, 640, 400, 200, 60, '出  击', () => {
            this.scene.start('BattleScene');
        }, {}, container);

        this.addTip(container, '');
    }

    // ========== 公共 UI 辅助 ==========

    addTitle(container, text) {
        const title = this.add.text(640, 30, text, {
            fontSize: '28px', fontFamily: 'Arial', color: '#ffffff',
        }).setOrigin(0.5);
        container.add(title);
    }

    addLabel(container, text, y) {
        const label = this.add.text(640, y, text, {
            fontSize: '16px', fontFamily: 'Arial', color: '#aaaaaa',
        }).setOrigin(0.5);
        container.add(label);
    }

    addTip(container, text) {
        const tip = this.add.text(640, 660, text || '← 点击屏幕边缘切换页面', {
            fontSize: '14px', fontFamily: 'Arial', color: '#666666',
        }).setOrigin(0.5);
        container.add(tip);
    }

    // ========== 业务逻辑 ==========

    onEquipSlotClick(index) {
        if (index < gameState.inventory.equipment.length) {
            gameManager.unequip(index);
        } else if (gameState.inventory.items.length > 0) {
            gameManager.equip(0);
        }
        this.refreshEquipPage();
    }

    refreshEquipPage() {
        for (let i = 0; i < this.equipSlots.length; i++) {
            const eq = i < gameState.inventory.equipment.length ? gameState.inventory.equipment[i] : null;
            this.equipSlots[i].setEquipment(eq);
        }
        this.refreshBackpack();
    }

    refreshBackpack() {
        for (const slot of this.backpackSlots) {
            slot.destroy();
        }
        this.backpackSlots = [];

        const slotSize = 60;
        const gap = 8;
        const count = Math.min(gameState.inventory.items.length, 10);
        const totalWidth = count * slotSize + (count - 1) * gap;
        const startX = (1280 - totalWidth) / 2;

        for (let i = 0; i < count; i++) {
            const x = startX + i * (slotSize + gap);
            const slot = new MenuSlot(this, x, 240, slotSize, (idx) => {
                this.onBackpackClick(idx);
            }, i, this.pageContainer[0]);
            slot.setEquipment(gameState.inventory.items[i]);
            this.backpackSlots.push(slot);
        }
    }

    onBackpackClick(index) {
        if (gameState.inventory.equipment.length < EQUIPMENT_SLOTS) {
            gameManager.equip(index);
        }
        this.refreshEquipPage();
    }

    buyItem(id) {
        gameManager.buyEquipment(id);
        this.refreshShopPage();
    }

    sellItem(index) {
        gameManager.sellEquipment(index);
        this.refreshShopPage();
    }

    refreshShopPage() {
        if (this.goldText) {
            this.goldText.setText(`金币: ${gameState.player.gold}`);
        }
    }
}