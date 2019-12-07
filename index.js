const fs = require('fs-extra');
const TelegramBot = require('node-telegram-bot-api');
const mixer = require('./mixer');

const token = "999735973:AAFzDNHXDunkFsV78Kr0aPA4F0YwPkjGQ7w";
const storeFileName = './storing.json';

const initialStore = {
  users: {},
  pairedUsers: []
};


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Here I check if fs exists
const storeExist = () => fs.exists(storeFileName);
const createStore = () => fs.writeJson(storeFileName, initialStore);
const writeStore = (store) => fs.writeJson(storeFileName, store);
const getStore = () => fs.readJson(storeFileName);


const addUser = async (id, user) => {
  const userExist = Boolean(store.users[id]);
  const store = await getStore();
  store.users[id] = user;
  await writeStore(store);
  return userExist;
}

const mixUserPair = async () => {
  const store = await getStore();
  const ids = Object.keys(store.users);
  const pairedUsers = mixer(ids);
  store.pairedUsers = pairedUsers;
  await writeStore(store);
}

const start = (msg) => {
  bot.sendMessage(msg.chat.id, 'Welcome', {
  reply_markup: {
      keyboard: [['/Join']]
  }});   
};


const join = async (msg) => {
  // Destructuring msg from telegram command
  const { chat, from } = msg;
  const userExist = await addUser(from.id, { username: from.username });
  
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chat.id, 'Received your message');
  
  if (userExist) {
    bot.sendMessage(from.id, 'User already exists');
  }
  
  await mixUserPair();
};

const main = async () => {              
  if (!await storeExist()) {
    await createStore();
  }
  
  bot.onText(/\/start/, start);
  // Listen for any kind of message. There are different kinds of
  // messages.
  bot.onText(/\/Join/, join);
};

main()