import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import express from "express"
//import { searchInPracuj } from "./pracuj.js";

//process.once('SIGINT', () => bot.stop('SIGINT'))
//process.once('SIGTERM', () => bot.stop('SIGTERM'))

dotenv.config();

const port = process.env.PORT ||3000;
const app = express();

const token = process.env.TELEGRAM_TOKEN;

const bot = new Telegraf(token);

const chatId = process.env.USER_ID;


export function telegramSendMessage(message) {
  bot.telegram.sendMessage(chatId, message)
}

function mainTelegram() {

  bot.command('start', (msg) => {
    telegramSendMessage("Welcome user");
  });
  bot.command('help', async (ctx) => {
    console.log('Wiadomość odebrana:', ctx.message.text);
    const message = "Commands:\n /help - pomoc\n /pracuj - ofert pracy ";

    //telegramSendMessage(message);
    await ctx.reply(message);
  });
  bot.command('pracuj', (msg) => {
    telegramSendMessage("Zaczyna sie wyszukiwanie...");
    //searchInPracuj();
  });
}



//Endpoint Express - nasłuchiwanie na porcie
app.get("/", (req, res) => {
  res.send("Serwer działa. Bot Telegram nasłuchuje.");
});

// Uruchomienie serwera Express
app.listen(port, () => {
  bot.launch();
  console.log(`Serwer nasłuchuje na porcie ${port}`);
  
  mainTelegram();

});