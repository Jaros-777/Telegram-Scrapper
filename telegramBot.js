import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import express from "express"
import { searchInPracuj } from "./pracuj.js";

dotenv.config();

const port = process.env.PORT ||3000;
const app = express();

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token);

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



// Endpoint Express - nasłuchiwanie na porcie
app.get("/", (req, res) => {
  res.send("Serwer działa. Bot Telegram nasłuchuje.");
});

// Uruchomienie serwera Express
app.listen(port, () => {
  console.log(`Serwer nasłuchuje na porcie ${port}`);
  mainTelegram();
});