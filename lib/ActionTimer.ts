/**
 * A class to execute specified action periodically
 */
export class ActionTimer {
    /**
     * Action is processing when timer is undefined
     */
    protected timer?: NodeJS.Timeout;
    /**
     * current action state
     */
    protected get isExecuting(): boolean {
        return !this.timer;
    }
    private _action?: () => Promise<void> | void;

    /**
     * @param intervalMilliSeconds The interval to call action.
     */
    constructor(private readonly intervalMilliSeconds: number) { }

    /**
     * Set action to be called periodically
     */
    public set action(value: () => Promise<void> | void) {
        this._action = value;
    }

    /**
     * It calls the action assigned by action setter
     * when predicate returns true and the action isn't executing.
     * @param predicate
     */
    public async notify(predicate: () => boolean): Promise<void> {
        if (!this.isExecuting && predicate()) {
            await this.execute();
        }
    }

    /**
     * Start the timer to call action.
     * It does nothing if it has already started.
     */
    public start(): void {
        if (!this.timer) {
            this.timer = global.setTimeout(() => this.execute(), this.intervalMilliSeconds);
        }
    }

    /**
     * Stop the timer to call action.
     */
    public stop(): void {
        this.clearTimer();
    }

    protected async execute(): Promise<void> {
        this.clearTimer();
        try {
            if (this._action) {
                await this._action();
            }
        } finally {
            this.start();
        }
    }

    private clearTimer() {
        if (this.timer) {
            global.clearTimeout(this.timer);
            this.timer = undefined;
        }
    }
}
