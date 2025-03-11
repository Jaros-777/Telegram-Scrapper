import puppeteer from "puppeteer";
import {Cluster} from 'puppeteer-cluster'
import { sorting } from './sorting.js'

const url = "https://it.pracuj.pl/praca?et=17&tc=0%2C2&wm=hybrid%2Chome-office&itth=33%2C34%2C38%2C73%2C76";

const main = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });

  try {
    // Sprawdź, czy przycisk akceptacji cookies jest widoczny i kliknij go
    await page.waitForSelector(".cookies_c1lmi0fl", { timeout: 200 });
    await page.click('button[data-test="button-submitCookie"]');
    console.log("Cookies accepted");
  } catch (error) {
    console.log("No cookies prompt found or it was dismissed already.");
  }

  const data = await page.evaluate(() => {
    const titles = [];

    document.querySelectorAll('[data-test="link-offer"]').forEach((el) => {
      titles.push(el.getAttribute("href"));
    });

    return titles;
  });

  //const links = data.splice(0, 35);
  const links = data;

  const arr=[]

  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT, // Ustaw współbieżność
    maxConcurrency: 2, // Maksymalna liczba procesów jednocześnie
    puppeteerOptions: {
      headless: true,
    },
  });

  await cluster.task(async ({ page, data: url }) => {
    try {
      await offert(page, url, arr);
    } catch (err) {
      console.log(`Error processing ${url}: ${err.message}`);
    }
  });
  
  links.forEach((link) => {
    cluster.queue(link); // Dodaj każdy link jako osobne zadanie
  });

  //const promises = links.map((link) => offert(link, arr));
  //await Promise.all(promises);
  
  
  await cluster.idle()
  await cluster.close()
  await browser.close();
  //console.log(arr);
  sorting(arr);

};

const offert = async (page, url, arr) => {
  //const browser = await puppeteer.launch({ headless: true });
  //const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  try {
    await page.waitForSelector(".cookies_bzjcezk", { timeout: 200 });
    await page.click('button[data-test="button-submitCookie"]');
    //console.log("Cookies accepted");
  } catch (error) {
    console.log("No cookie to accept");
  }

  const data = await page.evaluate(() => {
    const spec = [];

    document
      .querySelectorAll('[data-test="item-technologies-expected"]')
      .forEach((e) => {
        spec.push(e.innerHTML);
      });

    return spec;
  });

  arr.push(data);
  //console.log(data);

  //await browser.close();
};

main();

//offert("https://www.pracuj.pl/praca/fullstack-developer-warszawa,oferta,1003768375?s=d4d17fa9&searchId=MTczMzc2ODY3MzgxOC41NDY0")
