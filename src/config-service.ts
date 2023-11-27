import {Config, DEFAULT_CONFIG} from "./config";

export class ConfigService implements Config {
    generateNoiseFiles: boolean;
    headless: boolean;
    parallelBrowsers: number;
    mode: "realistic" | "dump";
    public constructor() {
        this.generateNoiseFiles = DEFAULT_CONFIG.generateNoiseFiles;
        this.headless = DEFAULT_CONFIG.headless;
        this.parallelBrowsers = DEFAULT_CONFIG.parallelBrowsers
        this.mode = DEFAULT_CONFIG.mode
    }
}
