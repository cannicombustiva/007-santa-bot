const Telegraf = require('telegraf')

const bot = new Telegraf("999735973:AAFzDNHXDunkFsV78Kr0aPA4F0YwPkjGQ7w")
bot.start((ctx) => ctx.reply('Welcome!'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()