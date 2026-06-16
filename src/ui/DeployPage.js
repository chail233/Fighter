// DeployPage - 出击页面 UI
// 职责：构建出击界面的显示和交互
// 不应：修改游戏数据

import { MenuButton } from './MenuButton.js';

export class DeployPage {
    constructor(scene, container) {
        this.scene = scene;
        this.container = container;

        const title = scene.add.text(640, 200, '准备出击', {
            fontSize: '36px', fontFamily: 'Arial', color: '#ffffff',
        }).setOrigin(0.5);
        container.add(title);

        const subtitle = scene.add.text(640, 250, '检查你的装备，准备迎战！', {
            fontSize: '18px', fontFamily: 'Arial', color: '#888888',
        }).setOrigin(0.5);
        container.add(subtitle);

        new MenuButton(scene, 640, 400, 200, 60, '出  击', () => {
            scene.scene.start('BattleScene');
        }, {}, container);
    }
}