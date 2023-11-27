import {Config} from "./config";
import {LOGGER} from "./logger";
import * as fs from "fs";
import {generateAndSaveRandomPNG} from "./util/pngutil";
import {getRandomFileName} from "./util/random-util";

export class FileProvider {
    public static getImage(config: Config): FileInfo {
        if (config.generateFiles) {
            LOGGER.info("Generating random png file...");
            const fileInfo: FileInfo = {
                dir: "./generated/",
                name: (Math.random() * 100000).toFixed(0) + ".png"
            }

            fs.mkdirSync(fileInfo.dir, {recursive: true})
            generateAndSaveRandomPNG(
                Math.floor(Math.random() * 1000) + 100,
                Math.floor(Math.random() * 1000) + 100,
                fileInfo.dir + fileInfo.name,
            );
            return fileInfo;
        } else {
            const fileInfo: FileInfo = {
                dir: "./upload-files/",
                name: ''
            }
            fs.mkdirSync(fileInfo.dir, {recursive: true})
            fileInfo.name = getRandomFileName(fileInfo.dir);
            return fileInfo;
        }
    }
}

export interface FileInfo {
    dir: string;
    name: string
}
