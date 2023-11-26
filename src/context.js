import {
  generateRandomEmail,
  generateRandomName,
  getRandomAddress,
  getRandomDomain,
  getRandomFileName,
  sample,
} from "./util/random-util.js";
import { CITIES } from "./util/cities.js";
import { generateAndSaveRandomPNG } from "./util/pngutil.js";
import * as fs from "fs";
import { LOGGER } from "./logger.js";

export class SubmitContext {
  /**
   * @type boolean
   */
  useMember;

  /**
   * @type string
   */
  personName;

  /**
   * @type {string}
   */
  cause = "";

  /**
   * @type {{first: string, last: string}}
   */
  _name;

  city = sample(CITIES);

  /**
   * @type {string}
   */
  email;

  /**
   * @type {string}
   */
  address;

  /**
   * @type {string}
   */
  fileName;

  /**
   * @type {string}
   */
  fileDir;

  /**
   * @type {boolean}
   */
  #generateImages;

  constructor(generateImages = true) {
    this.#generateImages = generateImages;

    this.useMember = Math.random() > 0;
    this._name = generateRandomName();
    this.personName = `${this._name.first} ${this._name.last}`;
    this.email = generateRandomEmail(
      this._name.first,
      this._name.last,
      getRandomDomain(),
    );
    this.address = getRandomAddress();

    if (this.#generateImages) {
      LOGGER.info("Generating random png file...");
      this.fileDir = "./generated/";
      this.fileName = (Math.random() * 10000).toFixed(0).toString(36) + ".png";
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
    if (this.#generateImages) {
      fs.rmSync(this.fileDir + this.fileName);
    }
  }
}
