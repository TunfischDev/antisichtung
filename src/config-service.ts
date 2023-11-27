import {Config, DEFAULT_CONFIG} from "./config";

export class ConfigService implements Config {
    generateFiles: boolean;
    headless: boolean;
    parallelBrowsers: number;
    public constructor() {
        this.generateFiles = DEFAULT_CONFIG.generateFiles;
        this.headless = DEFAULT_CONFIG.headless;
        this.parallelBrowsers = DEFAULT_CONFIG.parallelBrowsers
    }
}
