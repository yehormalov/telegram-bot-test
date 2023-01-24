const TelegramApi = require('node-telegram-bot-api');
const token = '5748517543:AAGPWOkYYm_DW3XT9dGQmBqgGJARwzOvCpw';

const bot = new TelegramApi(token, {polling: true});

const chats = {};
const { gameOptions, againOptions } = require('./options.js')

const startGame = async (chatId) => {
  chats[chatId] = Math.floor(Math.random() * 10);
  await bot.sendMessage(chatId, 'Отгадай число!', gameOptions);
}

const start = () => {
  bot.setMyCommands([
    {command: '/start', description: 'Приветствие'},
    {command: '/info', description: 'Получить информацию о боте'},
    {command: '/game', description: 'Игра "Угадай число!"'}
  ])
  
  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
  
    if (text === '/start') {
      await bot.sendMessage(chatId, 'Добро пожаловать');
      return await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/22c/b26/22cb267f-a2ab-41e4-8360-fe35ac048c3b/10.webp');
    } else if (text == '/info') {
      return await bot.sendMessage(chatId, 'Это тестовый телеграм бот написанный ' + msg.from.username);
    } else if (text == '/game') {
      return startGame(chatId)
    }
    
    bot.sendMessage(chatId, 'Ты о чем вообще?');
  })

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id

    if (data === '/again') {
      return startGame(chatId)
    }

    if (chats[chatId] == data) {
      return bot.sendMessage(chatId, `Угадал!`, againOptions)
    } else {
      return bot.sendMessage(chatId, `В другой раз! Бот загадал цифру ${chats[chatId]}`, againOptions)
    }
  })
}

start()