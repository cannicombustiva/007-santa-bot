const TelegramBot = require('node-telegram-bot-api');
const token = "999735973:AAFzDNHXDunkFsV78Kr0aPA4F0YwPkjGQ7w";

// I try to create a file system to store the IDs 
var file = require('file-system');
var fs = require('fs');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  console.log(msg.from.id)
  const chatId = msg.chat.id;

  fs.appendFile('storing.json', 'diofa!1', function(err) {
    if(err) throw err;
    console.log("saved!")
  })
  

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});

const storeCheck = (chatId) => {
  fs.readFile('storing.json', function (err, data) {
    var json = JSON.parse(data)
    json.push('search result: ' + currentSearchResult)

    fs.writeFile("results.json", JSON.stringify(json))
})

}

//999735973:AAFzDNHXDunkFsV78Kr0aPA4F0YwPkjGQ7w
//176835657