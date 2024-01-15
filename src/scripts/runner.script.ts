import { emailPasswords, nameToAccountAddress } from "../config.const";
import {
  clearAndInputTextXpath,
  clickOnXpath,
  createWorkerBrowser,
  initializeBrowserWithAccountName,
  sleep,
  stopBrowser,
} from "../helpers";

async function run() {
  for (const [accName, accAddress] of Object.entries(nameToAccountAddress)) {
    const { wss, user_id } = await initializeBrowserWithAccountName(accName);
    const { page } = await createWorkerBrowser(wss);

    await page.goto(
      "https://docs.google.com/forms/d/e/1FAIpQLSefXtO1nuC50P3wbDZ52_mDTChpzHN04xtVUxJQwA2wlQdkPg/viewform",
    );

    await page.bringToFront();

    // Wait for the page to load and check for the span
    const hasLoginSpan = await page.evaluate(() => {
      const spanUa = Array.from(document.querySelectorAll("span")).find(
        (element) => element.textContent === "Виберіть обліковий запис",
      );

      const spanEng = Array.from(document.querySelectorAll("span")).find(
        (element) => element.textContent === "Choose an account",
      );
      return spanUa !== undefined || spanEng !== undefined;
    });

    if (hasLoginSpan) {
      const XPATH_MY_ACC =
        '//*[@id="view_container"]/div/div/div[2]/div/div[1]/div/form/span/section/div/div/div/div/ul/li[1]/div/div[1]';

      await clickOnXpath(page, XPATH_MY_ACC);
      await sleep(3000);

      const XPATH_PASS_INPUT =
        "/html/body/div[1]/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div[1]/div/form/span/section/div/div/div[1]/div[1]/div/div/div/div/div[1]/div/div[1]/input";
      const pass = emailPasswords[accName];

      await clearAndInputTextXpath(page, XPATH_PASS_INPUT, pass);
      await sleep(1000);

      const XPATH_PASS_SUBMIT =
        "/html/body/div[1]/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div[2]/div/div[1]/div/div/button";

      await clickOnXpath(page, XPATH_PASS_SUBMIT);
      await sleep(5000);
    }

    // clicking on the body to remove popup
    const XPATH_BODY = "/html/body";
    await clickOnXpath(page, XPATH_BODY);
    await sleep(1000);

    await clickOnXpath(page, XPATH_BODY);
    await sleep(1000);

    const XPATH_ADDR_INPUT =
      "/html/body/div[1]/div[2]/form/div[2]/div/div[2]/div/div/div/div[2]/div/div[1]/div/div[1]/input";

    await clearAndInputTextXpath(page, XPATH_ADDR_INPUT, accAddress);
    await sleep(2000);

    const XPATH_ADDR_SUBMIT =
      "/html/body/div[1]/div[2]/form/div[2]/div/div[3]/div[1]/div[1]/div";

    await clickOnXpath(page, XPATH_ADDR_SUBMIT);
    await sleep(4000);
    await stopBrowser({ user_id });

    console.log(`${accName} successfully executed.`);
  }
}

run();
