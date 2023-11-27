import {Config} from "./config";
import {LOGGER} from "./logger";
import {SubmitContext} from "./context";
import {Page} from "playwright-core";
import {PageController} from "./page-controller";

export class Runner {

    private readonly config: Config;
    private state : 'ready' | 'active' | 'completed' | 'failed' = 'ready';
    private success = null;
    public constructor(public readonly runId: number, config: Config, private readonly submitContext: SubmitContext) {
        this.config = JSON.parse(JSON.stringify(config))
    }

    public async run(controller: PageController, page: Page): Promise<void> {
        this.state = 'active'
        LOGGER.info(`Run-${this.runId}: Starting...`);
        const startTime = Date.now();

        try {
            await controller.submitData(this.submitContext);
            LOGGER.info(`Run-${this.runId}: Done (took ${Date.now() - startTime}ms)`);
            this.success = true;
        } catch (e) {
            LOGGER.error(`Run-${this.runId}: Failed (took ${Date.now() - startTime}ms)`);
            LOGGER.error(e);
            this.success = false;
        } finally {
            LOGGER.info("Cleaning up generated files...")
            this.submitContext.cleanup()

            LOGGER.info("Reloading page...");
            await page.reload();
            LOGGER.info("Page reloaded!");
            this.state = this.success ? 'completed' : 'failed';
        }
    }

    public isFinished(): boolean {
        return this.state === 'completed' || this.state === 'failed';
    }

}
