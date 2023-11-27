export interface Config {

    /**
     * Whether to run the browsers without a gui
     */
    headless: boolean;

    /**
     * Whether to generate random images or choose from a directory
     */
    generateFiles: boolean;

    /**
     * Amount of browsers running in parallel
     */
    parallelBrowsers: number
}

export const DEFAULT_CONFIG: Config = {
    headless: false,
    generateFiles: true,
    parallelBrowsers: 1,
}
