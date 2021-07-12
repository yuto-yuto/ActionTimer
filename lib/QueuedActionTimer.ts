import { ActionTimer } from "./ActionTimer";

/**
 * A class that support ActionTimer by queue.
 * Push a function call into a queue
 * when predicate in notify function returns true while action is executing.
 */
export class QueuedActionTimer extends ActionTimer {
    private actionCount = 0;

    public async notify(predicate: () => boolean): Promise<void> {
        const isFulfilled = predicate();
        if (this.isExecuting && isFulfilled) {
            // The action is called after current execution is done
            this.actionCount++;
        } else if (!this.isExecuting && isFulfilled) {
            await this.execute();
        }
    }

    protected async execute(): Promise<void> {
        if (this.actionCount > 0) {
            this.actionCount--;
        }
        await super.execute();

        if (this.actionCount > 0) {
            await this.execute();
        }
    }
}
