import {Config} from "./config";
import {LOGGER} from "./logger";
import {Page} from "playwright-core";

export abstract class BaseRunner {

    protected readonly config: Config;
    private state : 'ready' | 'active' | 'completed' | 'failed' = 'ready';
    private success = null;
    protected constructor(public readonly runId: number, config: Config) {
        this.config = JSON.parse(JSON.stringify(config))
    }

    public async run(page: Page): Promise<void> {
        this.state = 'active'
        LOGGER.info(`Run-${this.runId}: Starting...`);
        const startTime = Date.now();

        try {
            await this.runInternal();
            LOGGER.info(`Run-${this.runId}: Done (took ${Date.now() - startTime}ms)`);
            this.success = true;
        } catch (e) {
            LOGGER.error(`Run-${this.runId}: Failed (took ${Date.now() - startTime}ms)`);
            LOGGER.error(e);
            this.success = false;
        } finally {
            LOGGER.info("Cleaning up generated files...")
            this.cleanup()
            this.state = this.success ? 'completed' : 'failed';
        }
    }

    public isFinished(): boolean {
        return this.state === 'completed' || this.state === 'failed';
    }

    protected abstract cleanup(): void;

    protected async runInternal(): Promise<void> {

    }

}
