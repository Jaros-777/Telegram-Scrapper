import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { searchInPracuj } from "./pracuj.js";

dotenv.config();
const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, {polling: true});

const chatId = process.env.USER_ID;


export function telegramSendMessage(message) {
  bot
    .sendMessage(chatId, message)
    .then((respone) => {
      console.log("Dziala");
    })
    .catch((error) => {
      console.log("Nie dziala");
    });
}

function mainTelegram() {

  bot.onText(/\/start/, (msg) => {
    telegramSendMessage("Welcome user");
  });
  bot.onText(/\/help/, (msg) => {
    const message = "Commands:\n /help - pomoc\n /pracuj - ofert pracy ";

    telegramSendMessage(message);
  });
  bot.onText(/\/pracuj/, (msg) => {
    telegramSendMessage("Zaczyna sie wyszukiwanie...");
    searchInPracuj();
  });
}

mainTelegram();
// const mes = {"tekst": "testowy tekst", "kolejny":"tekst"}
// telegramSendMessage(JSON.stringify(mes));