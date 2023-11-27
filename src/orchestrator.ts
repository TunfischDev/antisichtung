import {BF} from "./bean-factory";
import {ConfigService} from "./config-service";
import playwright, {Browser} from "playwright";
import {LOGGER} from "./logger";
import {BrowserContext} from "@playwright/test";
import {Page} from "playwright-core";
import {ZpsRunner} from "./zps-runner";

export class Orchestrator {

    private readonly config = BF.getBean(ConfigService)
    private browser: Browser;
    private slots: ComputeSlot[] = []

    public constructor() {
    }


    public async run(): Promise<void> {
        if (this.slots.length > 0) {
            return new Promise((resolve, reject) => {
                reject("Cannot run orchestrator while already active!");
            });
        }

        LOGGER.info("Launching browser...");
        this.browser = await playwright.chromium.launch({
            headless: this.config.headless
        });
        LOGGER.info(`Setting up ${this.config.parallelBrowsers} instances of chromium...`)

        // setting up as many windows as desired

        for (let i = 0; i < this.config.parallelBrowsers; i++) {
            const context = await this.browser.newContext({
                viewport: {
                    width: 700,
                    height: 900,
                },
            });
            const page = await context.newPage();
            await addPageInterceptors(page);
            await page.goto("https://afdbund.de/sichtung");
            this.slots.push({
                slotId: i,
                context, page, runner: null
            })
        }

        LOGGER.info('Browsers are ready...');

        let rid = 0;
        // every second, check for available slots, and assign a new runner to them
        setInterval(async () => {
            for (let i = 0; i < this.slots.length; i++) {
                const slot = this.slots [i];
                if (!slot.runner) {

                    LOGGER.info("Reloading page...");
                    await slot.page.reload();
                    LOGGER.info("Page reloaded!");
                    LOGGER.info(`Creating new runner in slot #${i}`)
                    slot.runner = this.setupRunner(slot, rid++);
                }
                if (slot.runner?.isFinished()) {
                    LOGGER.info(`Removing completed runner from slot #${i}`)
                    slot.runner = null;
                }
            }
        }, 1000)
    }

    private setupRunner(slot: ComputeSlot, runnerId: number): ZpsRunner {
        const runner = new ZpsRunner(runnerId, this.config, slot.page);
        runner.run(slot.page).then(() => {
            LOGGER.info(`Runner #${runner.runId} completed successfully on slot #${slot.slotId}!`)
        }).catch((err) => {
            LOGGER.info(`Runner #${runner.runId} failed on slot #${slot.slotId}! Reason: ${err}`)
        }).finally(async () => {
            slot.runner = null;
        });
        return runner;
    }
}


interface ComputeSlot {
    slotId: number;
    page: Page;
    context: BrowserContext;
    runner: ZpsRunner
}

/**
 * Block stylesheets and other media from being loaded (we dont need them)
 * @param page
 * @returns {Promise<void>}
 */
async function addPageInterceptors(page: Page): Promise<void> {
    await page.route("**/*", (route) => {
        const request = route.request();
        const resourceType = request.resourceType();
        if (
            resourceType === "image" ||
            resourceType === "font" ||
            resourceType === "stylesheet" ||
            // resourceType === "script" ||
            resourceType === "media"
        ) {
            route.abort();
        } else {
            route.continue();
        }
    });
}
