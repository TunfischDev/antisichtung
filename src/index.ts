import {LOGGER} from "./logger.js";
import playwright from "playwright";
import {SubmitContext} from "./context.js";
import {LineByLineReader} from "./util/linebylinereader.js";
import {CONFIG} from "./config.js";
import {Page} from "playwright-core";
import {Browser} from "playwright";
import {PageController} from "./page-controller.js";

async function main() {
  LOGGER.info("launching browser...");
  const browser = await newBrowser();

  LOGGER.info("connecting...");
  const context = await browser.newContext({
    viewport: {
      width: 700,
      height: 900,
    },
  });
  const page = await context.newPage();
  await addPageInterceptors(page);

  await page.goto("https://afdbund.de/sichtung");
  LOGGER.info("connected!");

  const controller = new PageController(page);

  const reader = new LineByLineReader('./bible.txt');

  const bible= [];

  reader.onNextLine(async line =>  {
      bible.push(line)
  })

    reader.onEnd(async () => {

        for (let j = 2000; j < bible.length; j++) {
            await singleRun(j, controller, page, bible[j])
        }
    })
}


/**
 *
 * @param {number} i
 * @param {PageController} controller
 * @param page
 * @param {string} text
 * @returns {Promise<void>}
 */
async function singleRun(i: number, controller: PageController, page: Page, text: string): Promise<void> {
    LOGGER.info(`Iteration ${i}: Starting...`);
    const startTime = Date.now();

    const context = new SubmitContext(CONFIG.generateNoiseFiles);
    try {
        context.cause = text;
        await controller.submitData(context);
        LOGGER.info(`Iteration ${i}: Done (took ${Date.now() - startTime}ms)`);
    } catch (e) {
        LOGGER.error(`Iteration ${i}: Failed (took ${Date.now() - startTime}ms)`);
        LOGGER.error(e);
    } finally {
        LOGGER.info("Cleaning up generated files...")
        context.cleanup()

        LOGGER.info("Reloading page...");
        await page.reload();
    }
}
async function newBrowser(): Promise<Browser> {
  return playwright.chromium.launch({
    headless: CONFIG.headless,
  });
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

(async () => {
  await main();
})();
