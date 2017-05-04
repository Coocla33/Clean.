//NodeJS Modules
const Discord = require('discord.js')

//External Files
const config = require('./config.json')
const handlerSetup = require('./handlers/setup.js')

let bot = new Discord.Client({disableEveryone: true})

//Startup
let startup = {'date': new Date(), 'started': false}

//global config
global.config = config
global.bot = bot
global.data = {suffix: '', usage: 0}

//Handler setup
handlerSetup.setup().then((handlers) => {
  global.handlers = handlers
  loadCommands()
  console.log(handlers.logger.info(new Date()) + 'Handlers ready (' + (new Date() - startup.date) + 'ms)')
}).catch((err) => {
  console.log(err)
})

//Load Commands
function loadCommands() {
  handlers.command.load().then((commands) => {
    console.log(handlers.logger.info(new Date()) + 'Loaded ' + commands.array.length + ' commands (' + (new Date() - startup.date) + 'ms)')
  })
}

//Login Discord bot
bot.login(config.token).then(() => {
  console.log(handlers.logger.info(new Date()) + 'Logged in (' + (new Date() - startup.date) + 'ms)')
})

bot.on('ready', () => {
  if (!startup.started) {
    console.log(handlers.logger.info(new Date()) + 'Ready (' + (new Date() - startup.date) + 'ms)')
    startup.started = true
  } else {
    console.log(handlers.logger.connect(new Date()) + 'Reconnected!')
  }
})

bot.on('message', (msg) => {
  handlers.command.execute(msg).then((response) => {
    if (response.type == 'default') {
      msg.channel.sendMessage(':no_entry: **' + response.response + '** `' + config.prefix + 'help ' + response.command + '`')
    } else if (response.type == 'error') {
      for (let id of config.master) {
        bot.fetchUser(id).then((user) => {
          console.error(handlers.logger.error(new Date(), response.command.toUpperCase()), response.err.stack)
          user.send('**ERROR! (' + response.command.toUpperCase() + ')** ```js\n' + response.err.stack + '```')
        })
      }
      msg.channel.send('An unexpected error has accured! This has been automaticly reported to the developers!')
    }
  }).catch((err) => {
    console.error(err)
    msg.channel.send(':bug: **ERROR!** Please report this to the developers!\n```js\n' + err + '```')
  })
})

bot.on('reconnecting', () => {
  console.log(handlers.logger.connect(new Date()) + 'Reconnecting...')
})

bot.on('disconnect', (event) => {
  console.log(handlers.logger.connect(new Date()) + 'Disconnected! (' + event.code + ')')
})
