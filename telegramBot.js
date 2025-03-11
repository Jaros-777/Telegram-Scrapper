import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv'

export function telegramSendMessage(message, bot, chatId){
    dotenv.config();

    bot.sendMessage(chatId, message)
    .then((respone) =>{
        console.log("Dziala");
    })
    .catch((error) => {
        console.log("Nie dziala");
    })
}

function mainTelegram(){
    dotenv.config();
    let command;
    const token = process.env.TELEGRAM_TOKEN;
    
    const bot = new TelegramBot(token, {polling: true});
    
    const chatId = process.env.USER_ID;

    bot.onText(/\/start/, (msg)=>{
        telegramSendMessage("Welcome user", bot, chatId);
    });
    bot.onText(/\/help/, (msg)=>{
        const message = "Commands:\n /help - pomoc\n /pracuj - ofert pracy "

        telegramSendMessage(message, bot, chatId);
    });
    bot.onText(/\/pracuj/, (msg)=>{
        telegramSendMessage("Oferty pracy na pracuj.pl", bot, chatId);
    });
}

mainTelegram();