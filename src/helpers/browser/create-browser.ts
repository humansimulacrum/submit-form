import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { getBrowserByName, openBrowser } from "./ads-api.helper";

export async function initializeBrowserWithAccountName(name: string) {
  const account = await getBrowserByName(name);

  if (!account) {
    console.log(`Account with name - ${name} is not found `);
    throw new Error();
  }

  const browser = await openBrowser({ user_id: account.user_id });
  return { wss: browser.data.ws.puppeteer, user_id: account.user_id };
}

export const createWorkerBrowser = async (wss: string) => {
  try {
    puppeteer.use(StealthPlugin());

    const browser = await puppeteer.connect({
      browserWSEndpoint: wss,
      defaultViewport: null,
      protocolTimeout: 10 * 60 * 1000,
      targetFilter: (target) => !!target.url,
    });

    const [page, ...otherPages] = await browser.pages();

    for (const otherPage of otherPages) {
      await otherPage.close();
    }

    return { browser, page };
  } catch (error) {
    console.log(error);
    throw Error();
  }
};
