import { Page } from "puppeteer";

export async function clickOnXpath(
  page: Page,
  xpath: string,
  waitTime: number = 5000,
) {
  await page.waitForXPath(xpath, { timeout: waitTime });
  const elementsOnXpath = await page.$x(xpath);
  if (elementsOnXpath.length > 0) {
    await (elementsOnXpath[0] as any).click();
  } else {
    throw new Error(`Element not found: ${xpath}`);
  }
}

export async function clickOnSelector(
  page: Page,
  selector: string,
  waitTime: number = 5000,
) {
  await page.waitForSelector(selector, { timeout: waitTime });
  await page.click(selector);
}

export async function clearAndInputTextXpath(
  page: Page,
  xpath: string,
  text: string,
  waitTime: number = 5000,
) {
  await page.waitForXPath(xpath, { timeout: waitTime });
  const elements = await page.$x(xpath);
  if (elements.length > 0) {
    const inputElement = elements[0];

    // Focus on the element
    await inputElement.focus();

    // Clear existing content
    const inputValue = await page.evaluate(
      (element) => (element as any).value,
      inputElement,
    );
    for (let i = 0; i < inputValue.length; i++) {
      await page.keyboard.press("Backspace");
    }

    // Type the new text
    await inputElement.type(text, { delay: 50 });
  } else {
    throw new Error(`Element not found: ${xpath}`);
  }
}

export async function inputTextSelector(
  page: Page,
  selector: string,
  text: string,
  waitTime: number = 5000,
) {
  await page.waitForSelector(selector, { timeout: waitTime });
  await page.type(selector, text);
}

export async function waitElementXpath(
  page: Page,
  xpath: string,
  waitTime: number = 5000,
) {
  await page.waitForXPath(xpath, { timeout: waitTime });
}

export async function waitElementSelector(
  page: Page,
  selector: string,
  waitTime: number = 5000,
) {
  await page.waitForSelector(selector, { timeout: waitTime });
}
