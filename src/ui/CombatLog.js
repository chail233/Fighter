// CombatLog - 战斗日志组件
// 职责：在屏幕左上角滚动显示战斗信息
// 不应：修改游戏数据

const MAX_VISIBLE = 6;
const DISPLAY_DURATION = 3000;
const LINE_HEIGHT = 22;

export class CombatLog {
    constructor(scene, x = 10, y = 90, maxWidth = 400) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.maxWidth = maxWidth;

        /** @type {{ text: string, addedAt: number, textObj: Phaser.GameObjects.Text }[]} */
        this.entries = [];
    }

    add(text) {
        const textObj = this.scene.add.text(this.x, this.y, text, {
            fontSize: '13px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            wordWrap: { width: this.maxWidth },
        }).setOrigin(0, 0).setAlpha(1);

        this.entries.push({ text, addedAt: Date.now(), textObj });

        if (this.entries.length > MAX_VISIBLE) {
            const removed = this.entries.shift();
            removed.textObj.destroy();
        }

        this.relayout();
    }

    update() {
        const now = Date.now();

        for (let i = this.entries.length - 1; i >= 0; i--) {
            const elapsed = now - this.entries[i].addedAt;

            if (elapsed >= DISPLAY_DURATION) {
                this.entries[i].textObj.destroy();
                this.entries.splice(i, 1);
            } else if (elapsed >= DISPLAY_DURATION - 500) {
                const alpha = (DISPLAY_DURATION - elapsed) / 500;
                this.entries[i].textObj.setAlpha(alpha);
            }
        }

        if (this.entries.length > 0) {
            this.relayout();
        }
    }

    relayout() {
        for (let i = 0; i < this.entries.length; i++) {
            this.entries[i].textObj.setY(this.y + i * LINE_HEIGHT);
        }
    }

    destroy() {
        for (const entry of this.entries) {
            entry.textObj.destroy();
        }
        this.entries.length = 0;
    }
}