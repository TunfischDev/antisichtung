export interface Config {

    /**
     * Whether to run the browsers without a gui
     */
    headless: boolean;

    /**
     * Whether to generate random images or choose from a directory
     */
    generateNoiseFiles: boolean;

    /**
     * Amount of browsers running in parallel
     */
    parallelBrowsers: number
    /**
     * Whether to generate many realistic looking entries or to dump large files
     */
    mode: 'realistic' | 'dump'
}

export const DEFAULT_CONFIG: Config = {
    headless: false,
    generateNoiseFiles: true,
    parallelBrowsers: 1,
    mode: 'realistic'
}
