import axios from "axios";
import * as cheerio from "cheerio";

const searchOfferts = async (mainUrl) => {
  const offerts = [];
  try {
    const respone = await axios.get(mainUrl);
    const $ = cheerio.load(respone.data);

    console.log($('div[data-test="section-offers"]').html().length);
    $('div[data-test="section-offers"]').each((index, e) => {
      //console.log(e);

      let cos = $(e).find("a").attr("href");
      offerts.push(cos);
    });
  } catch (error) {
    console.log(error);
  }

  console.log(offerts);
};

const searchNeeds = async (url) => {};

const mainUrl =
  "https://it.pracuj.pl/praca?et=17&tc=0%2C2&itth=33%2C34%2C76%2C73";
searchOfferts(mainUrl);
