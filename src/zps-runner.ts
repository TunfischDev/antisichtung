import {Config} from "./config";
import {BaseRunner} from "./base-runner";
import * as fs from "fs";
import {generateRandomEmail, generateRandomName, getRandomAddress, getRandomDomain, sample} from "./util/random-util";
import {CITIES} from "./util/cities";
import {FileInfo, FileProvider} from "./file-provider";
import {LOGGER} from "./logger";
import {Locator} from "@playwright/test";
import {Page} from "playwright-core";

export class ZpsRunner extends BaseRunner {

    private readonly leftSection: Locator;
    private readonly rightSection: Locator;
    private readonly firstForm: Locator;
    private readonly memberBtn: Locator;
    private readonly supporterBtn: Locator;
    private readonly personNameInput: Locator;

    private readonly fileInput: Locator;
    private readonly loadingComplete: Locator;
    private readonly nextStepButton: Locator;
    private readonly textArea: Locator;
    private readonly infoForm: Locator;
    private readonly infoFormMe: Locator;

    private readonly personAddressInput: Locator;
    private readonly personGroupInput: Locator;
    private readonly personEmailPhoneInput: Locator;
    private readonly personOtherInput: Locator;

    private readonly meNameInput: Locator;
    private readonly meEmailInput: Locator;
    private readonly mePhoneInput: Locator;

    private useMember = Math.random() > 0.5;
    private name: {first: string, last: string} = generateRandomName();
    private email = generateRandomEmail(this.name.first, this.name.last, getRandomDomain());
    private city = sample(CITIES);
    private address = getRandomAddress();
    private fileInfo: FileInfo;

    public constructor(runId: number, config: Config, page: Page) {
        super(runId, config);
        this.fileInfo = FileProvider.getImage(config);

        {
            this.leftSection = page.locator("section[left]");

            this.rightSection = page.locator("section[right]");
            this.firstForm = this.leftSection.locator("> div:nth-child(3) > section");
            this.memberBtn = this.firstForm.locator("div:nth-child(2) > button:first-child")
            this.supporterBtn = this.firstForm.locator("div:nth-child(2) > button:nth-child(2)")
            this.personNameInput = this.firstForm.locator("div:nth-child(2) > div > input");
            this.fileInput = this.rightSection.locator('input[type=file]');

            this.loadingComplete = this.rightSection.getByText("100 %");


            this.nextStepButton = page.locator("footer > div > button:nth-child(2)");
            this.textArea = this.leftSection.locator("textarea");


            this.infoForm = this.leftSection.locator("div:nth-child(3) > section > div:nth-child(2)")
            this.personAddressInput = this.infoForm.locator("div:nth-child(1) > input")
            this.personGroupInput = this.infoForm.locator("div:nth-child(2) > input")
            this.personEmailPhoneInput = this.infoForm.locator("div:nth-child(3) > input")
            this.personOtherInput = this.infoForm.locator("div:nth-child(4) > input")


            this.infoFormMe = this.rightSection.locator("div > section > div:nth-child(2)")
            this.meNameInput = this.infoFormMe.locator("div:nth-child(1) > input")
            this.meEmailInput = this.infoFormMe.locator("div:nth-child(2) > input")
            this.mePhoneInput = this.infoFormMe.locator("div:nth-child(3) > input")
        }
    }

    public getCompleteFilePath() {
        return this.fileInfo.dir + this.fileInfo.name
    }

    protected cleanup(): void {
        if (this.config.generateFiles) {
            fs.rmSync(this.getCompleteFilePath());
        }
    }

    protected override async runInternal(): Promise<void> {
        await this.submitPage1();
        await this.submitPage2();
        await this.submitPage3()
    }

    async submitPage1(): Promise<void> {
        if (this.useMember) {
            await this.memberBtn.click()
        } else {
            await this.supporterBtn.click()
        }

        await this.personNameInput.fill(this.name.first + ' ' + this.name.last);

        await this.nextStepButton.click();
    }

    async submitPage2(): Promise<void> {

        /* TODO generate random text
        LOGGER.info(`Setting text '${this.}'`)
        await this.textArea.fill(context.cause)*/

        LOGGER.info("Uploading file '" + this.getCompleteFilePath() + "', this may take a while...")
        await this.fileInput.setInputFiles(this.getCompleteFilePath());

        await this.rightSection.locator('svg[class="text-green-700 fill-green-700"]').waitFor({
            timeout: 60 * 60 * 1000 // wait up to one hour until the green haken appears
        })

        await this.rightSection.getByText(this.fileInfo.name).waitFor()

        await this.nextStepButton.click();
    }

    async submitPage3() {

        await this.personAddressInput.fill(this.address)
        await this.personGroupInput.fill(this.city)
        await this.personEmailPhoneInput.fill(this.email)
        await this.personOtherInput.fill("")

        await this.meNameInput.fill("")
        await this.meEmailInput.fill("")
        await this.mePhoneInput.fill("")
        await this.nextStepButton.click();
    }
}
