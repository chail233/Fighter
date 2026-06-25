import { PageNavigator } from '../ui/PageNavigator.js';
import { EquipPage } from '../ui/EquipPage.js';
import { ShopPage } from '../ui/ShopPage.js';
import { StagePage } from '../ui/StagePage.js';
import gameManager from '../GameManager.js';
import gameState from '../GameState.js';
import { getStageById, getStageMenuMusic } from '../data/stageConfig.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // 根据当前关卡播放菜单 BGM
        const stage = getStageById(gameState.stageRun ? gameState.stageRun.stageId : 1);
        const menuBgm = getStageMenuMusic(stage);
        gameManager.playMusic(this, menuBgm);
        this.currentPage = 0;
        this.totalPages = 3;
        this.pageContainer = [];
        this.pages = [];

        for (let i = 0; i < this.totalPages; i++) {
            const container = this.add.container(0, 0);
            container.setVisible(i === 0);
            this.pageContainer.push(container);
        }

        this.pages[0] = new EquipPage(this, this.pageContainer[0]);
        this.pages[1] = new ShopPage(this, this.pageContainer[1]);
        this.pages[2] = new StagePage(this, this.pageContainer[2]);

        this.navigator = new PageNavigator(this, this.totalPages, (page) => {
            this.pageContainer[this.currentPage].setVisible(false);
            this.currentPage = page;
            this.pageContainer[page].setVisible(true);

            // 切到装备页时刷新显示
            if (page === 0) this.pages[0].refresh();
            // 切到商店页时刷新金币
            if (page === 1) this.pages[1].refresh();
            // 切到关卡页时刷新节点
            if (page === 2) this.pages[2].refresh();
        });
    }
}
