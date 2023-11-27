import {Command} from "commander";
import {BF} from "./bean-factory";
import {ConfigService} from "./config-service";
import {Orchestrator} from "./orchestrator";

async function main() {

    const program = new Command();
    program.name("anti-sichtung").description("Tool um das ZfPS automatisiert vollzumüllen");

    program.option("-g --generate-files", "Automatisch nonsense-Dateien generieren anstatt Dateien aus ./upload-files hochzuladen", false)
        .option("-p <number>", "Anzahl der parallel gestarteten Browser", "1")
        .option('--headless', "Starte Browser ohne GUI", false)
        .action(async (args: {generateFiles: boolean, p: number, headless: boolean}) => {
            console.log(args)
            if (args.p <= 0) {
                throw new Error(`Must run at least one instance!`)
            }
            const config = BF.getBean(ConfigService);
            config.generateFiles = args.generateFiles;
            config.parallelBrowsers = args.p;
            config.headless = args.headless
            const orchestrator = new Orchestrator();
            await orchestrator.run();
        })

    program.parse()
}

(async () => {
  await main();
})();
