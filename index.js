const TelegramBot = require('node-telegram-bot-api');
const token = "999735973:AAFzDNHXDunkFsV78Kr0aPA4F0YwPkjGQ7w";

// I try to create a file system to store the IDs 
var file = require('file-system');
var fs = require('fs');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

//Get the storing file where you'll save the ids
const getStore = () => new Promise((resolve, reject) => {
  fs.readFile('storing.json', (err, data) => {
    if (err) {
      return reject(err);
    }    
    try {
      // Il try serve perché se il json è rotto json.parse si rompe, almeno lo sai e puoi catchare
      const json = JSON.parse(data);
      return resolve(json);
    } catch (error) {
      reject(error);
    }
  })
});


const userExist = (store, userId) => store.id.find(id => id === userId);

const run = async (personalId, msg) => {
  const store = await getStore();

  if (userExist(store, personalId)) {
    bot.sendMessage(msg.chat.id, 'User stored yet');
  } else {
    fs.readFile('storing.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
      result = JSON.parse(data); //now it an object
      result.id.push(personalId); //add some data
      result.user.push(msg.from.username)
      json = JSON.stringify(result); //convert it back to json
      fs.writeFile('storing.json', json, 'utf8', function(err, result) {
        if(err) console.log('error', err);
      }); // write it back 
  }});

  }
}

// Here I check if fs exists
const storeCheck = (fs) => {
  if(fs.existsSync("./storing.json")){
    return true;
  } else {
    return false;
  }
}

const play = async (msg) => {

  const store = await getStore();
  const santas = store.id;
  const santasUsers = store.user;
  const children = [...santas];
  const childrenUsers = [...santasUsers];

  //let santa = santas[Math.floor(Math.random()*items.length)];
  
  while(santas.length > 0 && children.length > 0) {
    //Math.floor(Math.random() * songs.length); santas[Math.floor(Math.random()*santas.length)];
    let index1 = Math.floor(Math.random() * santas.length);
    let index2 = Math.floor(Math.random() * santas.length);

    let pair = [santas[index1], children[index2]];
    let pairByUser = [santasUsers[index1], childrenUsers[index2]];

    if(pair[0] != pair[1]){
      bot.sendMessage(pair[0], 'You will be ' + pairByUser[1] + ' santa');   
      santas = santas.filter(item => item !== pair[0])
      children = children.filter(item => item !== pair[1])
      santasUsers = santasUsers.filter(item => item !== pairByUser[0])
      childrenUsers = childrenUsers.filter(item => item !== childrenUsers[0])
    }

  }
}

const main = () => {
  const m = new Map();
  bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Welcome', {
    reply_markup: {
        keyboard: [['/Join', '/Play']]
    }});   
  });

  // Listen for any kind of message. There are different kinds of
  // messages.
  bot.onText(/\/Join/, (msg) => {
    console.log(msg.from.id)
    const chatId = msg.chat.id;
    const personalId = msg.from.id;

      if(storeCheck(fs) === true) {
        run(personalId, msg);
      } else {
          let result = {
            "id" : [],
            "user" : []
          };
        let data = JSON.stringify(result);
        fs.writeFileSync('storing.json', data);

      }
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Received your message');
  });

  bot.onText(/\/Play/, (msg) => {
    console.log(msg.from.id)
    const chatId = msg.chat.id;
    const personalId = msg.from.id;
    play(msg);
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Merry Christmas!');
  });

  bot.onText(/\/Dio/, (msg) =>{
    m.set('id', msg.from.id)
    m.set('first', msg.from.first_name)
    m.set('last', msg.from.last_name)
    m.set('nick', msg.from.username)
    n.set('id', m.id);

    object = {}
  
    m.forEach((value, key) => {
      var keys = key.split('.'),
          last = keys.pop();
      keys.reduce((r, a) => r[a] = r[a] || {}, object)[last] = value;
  });

  console.log(object);
  })
};

main()