// PageNavigator - 页面导航组件
// 职责：左右点击区域 + 箭头图标 + 页面指示器
// 不应：包含业务逻辑

export class PageNavigator {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} totalPages - 总页数
     * @param {(delta: number) => void} onSwitch - 切换回调
     */
    constructor(scene, totalPages, onSwitch) {
        this.scene = scene;
        this.totalPages = totalPages;
        this.currentPage = 0;
        this.onSwitch = onSwitch;

        // 左侧半屏点击
        const leftHit = scene.add.rectangle(160, 360, 320, 720).setInteractive({ useHandCursor: true });
        leftHit.setAlpha(0.001);
        leftHit.on('pointerdown', () => this.switchPage(-1));

        // 右侧半屏点击
        const rightHit = scene.add.rectangle(1120, 360, 320, 720).setInteractive({ useHandCursor: true });
        rightHit.setAlpha(0.001);
        rightHit.on('pointerdown', () => this.switchPage(1));

        // 箭头图标
        const leftArrow = scene.add.text(60, 360, '◀', {
            fontSize: '40px', fontFamily: 'Arial', color: '#ffffff',
        }).setOrigin(0.5);

        const rightArrow = scene.add.text(1220, 360, '▶', {
            fontSize: '40px', fontFamily: 'Arial', color: '#ffffff',
        }).setOrigin(0.5);

        // 页面指示器
        this.indicator = scene.add.text(640, 700, '', {
            fontSize: '14px', fontFamily: 'Arial', color: '#666666',
        }).setOrigin(0.5);

        this.updateIndicator();

        // 键盘
        scene.input.keyboard.on('keydown-LEFT', () => this.switchPage(-1));
        scene.input.keyboard.on('keydown-RIGHT', () => this.switchPage(1));
    }

    switchPage(delta) {
        const names = ['装备管理', '商店', '出击', '调试'];
        const newPage = Phaser.Math.Clamp(this.currentPage + delta, 0, this.totalPages - 1);
        if (newPage === this.currentPage) return;

        this.currentPage = newPage;
        this.updateIndicator();
        this.onSwitch(newPage);
    }

    updateIndicator() {
        const names = ['装备管理', '商店', '出击', '调试'];
        this.indicator.setText(`${names[this.currentPage] || ''} (${this.currentPage + 1}/${this.totalPages})`);
    }
}