import puppeteer from "puppeteer";
import { telegramSendMessage } from "./telegramBot.js";

const webLink = ["https://www.pracuj.pl/"];
let detailsJobOffert = [];

const searchSpecificOffers = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(webLink[0], { waitUntil: "networkidle2" });

  try {
    // Sprawdź, czy przycisk akceptacji cookies jest widoczny i kliknij go
    await page.waitForSelector(".cookies_c1lmi0fl", { timeout: 200 });
    await page.click('button[data-test="button-submitCookie"]');
  } catch (error) {
    console.log("Nie trzeba akceptować cookies");
  }

  try {
    // sprawdz czyh okienk z biletami jest
    await page.waitForSelector(".popup_p1fe0zyi", { timeout: 200 });
    await page.click("span.popup_p1c6glb0");
  } catch (error) {
    console.log("Nie ma okienka z reklamą");
  }

  await page.click('button[data-tab-value="It"]');
  await page.click(
    'button[data-test="filters-advanced-triggers-specializations-button"]'
  );
  await page.waitForSelector(
    'div[data-test="dropdown-content-advancedFilters"]',
    { timeout: 200 },
    { visible: true }
  );

  await page.evaluate(() => {
    document
      .querySelector(
        'label[data-test="select-option-home-office"] input[type="checkbox"]'
      )
      .click();
  });
  await page.evaluate(() => {
    document
      .querySelector(
        'label[data-test="select-option-hybrid"] input[type="checkbox"]'
      )
      .click();
  });

  await page.evaluate(() => {
    document.querySelector('span[data-test="select-option-33"]').click();
  });
  await page.evaluate(() => {
    document.querySelector('span[data-test="select-option-34"]').click();
  });
  await page.evaluate(() => {
    document.querySelector('span[data-test="select-option-38"]').click();
  });
  await page.evaluate(() => {
    document.querySelector('span[data-test="select-option-73"]').click();
  });
  await page.evaluate(() => {
    document.querySelector('span[data-test="select-option-76"]').click();
  });

  await page.evaluate(() => {
    document
      .querySelector(
        'label[data-test="select-option-17"] input[type="checkbox"]'
      )
      .click();
  });
  await page.evaluate(() => {
    document
      .querySelector(
        'label[data-test="select-option-0"] input[type="checkbox"]'
      )
      .click();
  });
  await page.evaluate(() => {
    document
      .querySelector(
        'label[data-test="select-option-2"] input[type="checkbox"]'
      )
      .click();
  });

  await Promise.all([
    page.evaluate(() => {
      document.querySelector('button[data-test="search-button"]').click();
    }),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);

  try {
    // sprawdz czyh okienk z biletami jest
    await page.waitForSelector(".popup_p1fe0zyi", { timeout: 200 });
    await page.click("span.popup_p1c6glb0");
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

  let linkJobList = data;
  //console.log(linkJobList);

  // await Promise.all(
  //   linkJobList.map(async (jobUrl)=>{
  //     await searchSpecificDetailsJobOffert(jobUrl, browser);
  //   })
  // )
  await searchSpecificDetailsJobOffert(linkJobList[0], browser);
  await searchSpecificDetailsJobOffert(linkJobList[1], browser);
  await searchSpecificDetailsJobOffert(linkJobList[2], browser);

  // for(let i=0; i < buforJobList.length ; i++)
  // {
  //   telegramSendMessage(JSON.stringify(buforJobList[i]));
  // }
  //await browser.close();
};

const searchSpecificDetailsJobOffert = async (jobUrl, browser) => {
  const page = await browser.newPage();

  await page.goto(jobUrl, { waitUntil: "networkidle2" });

  try {
    // Sprawdź, czy przycisk akceptacji cookies jest widoczny i kliknij go
    await page.waitForSelector(".cookies_c1lmi0fl", { timeout: 200 });
    await page.click('button[data-test="button-submitCookie"]');
  } catch (error) {
    console.log("Nie trzeba akceptować cookies");
  }

  try {
    // sprawdz czyh okienk z biletami jest
    await page.waitForSelector(".popup_p1fe0zyi", { timeout: 200 });
    await page.click("span.popup_p1c6glb0");
  } catch (error) {
    console.log("Nie ma okienka z reklamą");
  }

  const details = await page.evaluate(() => {
    let detailsOffert = [];

    detailsOffert.push(
      document.querySelector('h1[data-test="text-positionName"]').innerHTML
    );

    let skills = [];
    document
      .querySelectorAll('span[data-test="item-technologies-expected"]')
      .forEach((e) => {
        skills.push(e.innerHTML);
      });

    let require = [];
    document.querySelectorAll("span.tkzmjn3")
    .forEach((e) => {
      require.push(e.textContent.trim()); // Użyj textContent zamiast innerHTML
    });

    detailsOffert.push(skills);
    detailsOffert.push(require);

    return detailsOffert;
  });

  console.log(details);
  //console.log( document.querySelector('h1[data-test="text-positionName"]').innerHTML);
  //console.log( document.querySelectorAll('span[data-test="item-technologies-expected"]').innerHTML);
  //console.log( document.querySelectorAll('span[data-test="b194hobg core_ig18o8w size-xlarge position-center"]').innerHTML);
};

searchSpecificOffers();
