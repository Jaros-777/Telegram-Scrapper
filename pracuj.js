import puppeteer from "puppeteer";
import { telegramSendMessage } from "./telegramBot.js";

const webLink = ["https://www.pracuj.pl/"];
let jobOffert = [];

const searchSpecificOffers = async () => {
  let executablePath;

  // Sprawdzamy, czy aplikacja działa na Render
  if (process.env.IS_RENDER === 'true') {
    // Na Render używamy Chromium, ponieważ nie ma tam Chrome
    executablePath = "/usr/bin/google-chrome-stable"; 
  } else {
    // Jeśli działamy lokalnie, sprawdzamy, czy Chrome jest zainstalowane
    try {
      // Jeśli masz Puppeteer zainstalowane z opcją, która instaluje przeglądarkę, używamy domyślnej ścieżki
      executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
      
    } catch (error) {
      console.error("Puppeteer nie może znaleźć przeglądarki, sprawdź instalację.");
      throw error;
    }
  }


  const browser = await puppeteer.launch({
    headless: "new",
    executablePath,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process"
    ]
  });
  const page = await browser.newPage();

  await page.goto(webLink[0], { waitUntil: "networkidle2" });

  try {
    await page.waitForSelector(".cookies_c1lmi0fl", { timeout: 200 });
    await page.click('button[data-test="button-submitCookie"]');
  } catch (error) {
    console.log("There is no cookie window in main page");
  }

  try {
    await page.waitForSelector(".popup_p1fe0zyi", { timeout: 200 });
    await page.click("span.popup_p1c6glb0");
  } catch (error) {
    console.log("There is no advert window in main page");
  }

  //Selecting a categories

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

  //You are in offerts page

  try {
    await page.waitForSelector(".popup_p1fe0zyi", { timeout: 200 });
    await page.click("span.popup_p1c6glb0");
  } catch (error) {
    console.log("There is no advert window in offerts page");
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

  await browser.close();
};

const searchSpecificDetailsJobOffert = async (jobUrl, browser) => {
  const page = await browser.newPage();

  await page.goto(jobUrl, { waitUntil: "networkidle2" });

  try {
    await page.waitForSelector(".cookies_c1lmi0fl", { timeout: 200 });
    await page.click('button[data-test="button-submitCookie"]');
  } catch (error) {
    console.log("There is no cookie window in selected job offert");
  }

  try {
    await page.waitForSelector(".popup_p1fe0zyi", { timeout: 200 });
    await page.click("span.popup_p1c6glb0");
  } catch (error) {
    console.log("There is no advert window in selected job offert");
  }

  //const details = await page.evaluate((jobUrl) => {
  let detailsOffert = {};

  const getJobTitle = await page.evaluate(() => {
    return document.querySelector(
      'h1[data-test="text-positionName"]'
    ).innerHTML;
  });
  const getJobSkills = await page.evaluate(() => {
    let skills = [];
    document
    .querySelectorAll('span[data-test="item-technologies-expected"]')
    .forEach((e) => {
      skills.push(e.innerHTML);
    });

    return skills;
  });
  const getJobRequire = await page.evaluate(() => {
    let require = [];
    document.querySelectorAll("li.tkzmjn3").forEach((e) => {
        require.push(e.textContent.trim()); 
      });

    return require;
  });

  

  detailsOffert["title"] = getJobTitle;
  detailsOffert["skills"] = getJobSkills;
  detailsOffert["require"] = getJobRequire;
  detailsOffert["jobUrl"] = jobUrl;



  //return detailsOffert;
  // });

  //console.log(details);
  jobOffert.push(detailsOffert);
};

export async function searchInPracuj() {
  await searchSpecificOffers();

  //console.log(jobOffert);

  for (let item of jobOffert) {
    let i = 1;

    let messageToSend = `${i}. ${item.title}\n\n`
    item.skills.forEach((skill)=>{
      messageToSend += `- ${skill}\n`
    })

    messageToSend += `\n\n`
    item.require.forEach((require)=>{
      messageToSend += `- ${require}\n`
    })
    messageToSend += `\n\n`

    messageToSend += `${item.jobUrl}`

    console.log(messageToSend);
    telegramSendMessage(messageToSend);
    i++;
  }
}

//searchInPracuj();
