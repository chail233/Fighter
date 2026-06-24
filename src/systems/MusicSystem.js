// MusicSystem - 背景音乐管理单例
// 职责：播放/切换 BGM，确保同一时间只有一首 BGM
// 不应：游戏逻辑、UI 显示

class MusicSystem {
    constructor() {
        if (MusicSystem._instance) return MusicSystem._instance;
        MusicSystem._instance = this;

        this.currentKey = null;     // 当前正在播放的 key
        this.currentScene = null;   // 当前播放 scene
    }

    play(scene, key, loop = true) {
        if (!scene) return;

        // 同一场景同一曲目不重复播放
        if (this.currentKey === key && this.currentScene === scene) return;

        // 强制停止旧场景的所有声音
        if (this.currentScene) {
            try {
                this.currentScene.sound.stopAll();
            } catch (e) {
                // 场景可能已销毁
            }
        }

        // 播放新曲目
        const sound = scene.sound.add(key, { loop, volume: 0.3 });
        sound.play();

        this.currentKey = key;
        this.currentScene = scene;
    }
}

export const musicSystem = new MusicSystem();