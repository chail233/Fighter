// Equipment - 所有装备的基类
// 职责：定义装备运行时状态（名字、CD、效果触发）
// 不应：存放装备静态配置

export class Equipment {
    /**
     * @param {object} config - 装备配置对象
     * @param {string} config.id - 装备唯一标识
     * @param {string} config.name - 装备名
     * @param {number} config.cooldown - 冷却时间（秒）
     * @param {Function} config.effect - CD 结束时执行的效果 (owner, target) => void
     */
    constructor(config) {
        this.id = config.id || '';
        this.name = config.name || '未命名装备';
        this.cooldown = config.cooldown || 0;   // 总冷却（秒）
        this.effect = config.effect || null;    // CD 结束时回调

        this.cooldownTimer = 0;   // 当前冷却剩余（秒）
    }

    /**
     * 每帧调用，更新冷却状态
     * @param {number} delta - 帧间隔（毫秒）
     * @param {object} owner - 装备持有者（通常是 Player）
     */
    update(delta, owner) {
        if (this.cooldownTimer <= 0) return;

        this.cooldownTimer -= delta / 1000;
        if (this.cooldownTimer <= 0) {
            this.cooldownTimer = 0;
            this.onCooldownEnd(owner);
        }
    }

    /**
     * 触发装备效果（重置 CD 并执行效果）
     * @param {object} owner - 装备持有者
     * @param {object} target - 效果目标（通常是 Enemy）
     */
    use(owner, target) {
        if (this.cooldownTimer > 0) return;  // CD 中，不可用
        this.cooldownTimer = this.cooldown;

        if (typeof this.effect === 'function') {
            this.effect(owner, target);
        }
    }

    /**
     * CD 结束时的回调，供子类重写
     */
    onCooldownEnd(owner) {
        // 子类可在此处添加 CD 结束时的额外逻辑
    }

    /** 装备是否可用（CD 已转好） */
    get isReady() {
        return this.cooldownTimer <= 0;
    }

    /** 冷却进度 (0~1) */
    get cooldownProgress() {
        if (this.cooldown <= 0) return 1;
        return 1 - (this.cooldownTimer / this.cooldown);
    }
}