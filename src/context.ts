import {
  generateRandomEmail,
  generateRandomName,
  getRandomAddress,
  getRandomDomain,
  getRandomFileName,
  sample,
} from "./util/random-util";
import { CITIES } from "./util/cities";
import { generateAndSaveRandomPNG } from "./util/pngutil";
import * as fs from "fs";
import {LOGGER} from "./logger";

export class SubmitContext {
  useMember: boolean;
  personName: string;
  cause = "";

  _name: {
    first: string,
    last: string
  };

  city = sample(CITIES);

  email: string

  address: string;

  fileName: string;

  fileDir: string;

  constructor(private readonly generateImages = true) {
    this.useMember = Math.random() > 0;
    this._name = generateRandomName();
    this.personName = `${this._name.first} ${this._name.last}`;
    this.email = generateRandomEmail(
      this._name.first,
      this._name.last,
      getRandomDomain(),
    );
    this.address = getRandomAddress();

    if (this.generateImages) {
      LOGGER.info("Generating random png file...");
      this.fileDir = "./generated/";
      this.fileName = (Math.random() * 100000).toFixed(0) + ".png";
      fs.mkdirSync(this.fileDir, {recursive: true})
      generateAndSaveRandomPNG(
        Math.floor(Math.random() * 1000) + 100,
        Math.floor(Math.random() * 1000) + 100,
        this.getCompleteFilePath(),
      );
    } else {
      this.fileDir = "./upload-files/";
      fs.mkdirSync(this.fileDir, {recursive: true})
      this.fileName = getRandomFileName("./upload-files/");
    }
  }

  getCompleteFilePath() {
    return this.fileDir + this.fileName;
  }

  cleanup() {
    if (this.generateImages) {
      fs.rmSync(this.fileDir + this.fileName);
    }
  }
}
