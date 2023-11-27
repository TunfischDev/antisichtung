import {Page} from "playwright-core";
import {Locator} from "@playwright/test";
import {LOGGER} from "./logger.js";
import {SubmitContext} from "./context.js";

export class PageController {

    leftSection: Locator;
    rightSection: Locator;
    firstForm: Locator;
    memberBtn: Locator;
    supporterBtn: Locator;
    personNameInput: Locator;

    fileInput: Locator;
    loadingComplete: Locator;
    nextStepButton: Locator;
    textArea: Locator;
    infoForm: Locator;
    infoFormMe: Locator;

    personAddressInput: Locator;
    personGroupInput: Locator;
    personEmailPhoneInput: Locator;
    personOtherInput: Locator;

    meNameInput: Locator;
    meEmailInput: Locator;
    mePhoneInput: Locator;


    constructor(page: Page) {

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


    async submitData(context: SubmitContext): Promise<void> {
        await this.submitPage1(context);
        await this.submitPage2(context);
        await this.submitPage3(context)
    }

    async submitPage1(context: SubmitContext): Promise<void> {
        if (context.useMember) {
            await this.memberBtn.click()
        } else {
            await this.supporterBtn.click()
        }

        await this.personNameInput.fill(context.personName);

        await this.nextStepButton.click();
    }

    async submitPage2(context: SubmitContext): Promise<void> {

        LOGGER.info(`Setting text '${context.cause}'`)
        await this.textArea.fill(context.cause)

        LOGGER.info("Uploading file '" + context.getCompleteFilePath() + "', this may take a while...")
        await this.fileInput.setInputFiles(context.getCompleteFilePath());

        // wait for 2 seconds, then the image should be there

        await this.rightSection.locator('svg[class="text-green-700 fill-green-700"]').waitFor({
            timeout: 60 * 1000 // wait up to one minute until the green haken appears
        })

        await this.rightSection.getByText(context.fileName).waitFor()

        await this.nextStepButton.click();
    }

    async submitPage3(context: SubmitContext) {

        await this.personAddressInput.fill(context.address)
        await this.personGroupInput.fill(context.city)
        await this.personEmailPhoneInput.fill(context.email)
        await this.personOtherInput.fill("")

        await this.meNameInput.fill("")
        await this.meEmailInput.fill("")
        await this.mePhoneInput.fill("")
        await this.nextStepButton.click();
    }


}
