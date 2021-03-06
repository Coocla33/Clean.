//NodeJS Modules
const Discord = require('discord.js')

//External Files
const config = require('./config.json')
const webServer = require('./web/server.js')
const handlerSetup = require('./handlers/setup.js')

//Create new bot Client
let bot = new Discord.Client({disableEveryone: true})

//Startup
let startup = {'date': new Date(), 'started': false}

//global config
global.config = config
global.bot = bot
global.data = {}
global.webServer = webServer
global.srcDirectory = __dirname

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
  }).catch((err) => {
    console.log(err)
  })
}

//Login Discord bot
bot.login(config.token).then(() => {
  console.log(handlers.logger.info(new Date()) + 'Logged in (' + (new Date() - startup.date) + 'ms)')
})

bot.on('ready', () => {
  if (!startup.started) {
    console.log(handlers.logger.info(new Date()) + 'Ready (' + (new Date() - startup.date) + 'ms)')
    if (config.mode != 'development') {
      bot.user.setPresence({'game': {'name': 'c.help'}})
    }
    startup.started = true
    loadServer()
  } else {
    console.log(handlers.logger.connect(new Date()) + 'Reconnected!')
  }
})

//Setup WebServer
function loadServer() {
  webServer.run().then((response) => {
    console.log(handlers.logger.web(new Date()) + response)
  }).catch((err) => {
    console.error(err)
  })
}

bot.on('message', (msg) => {
  if (config.mode == 'normal') {
    handlers.command.execute(msg).then((response) => {
      if (response.type == 'default') {
        msg.channel.send(':no_entry: **' + response.response + '** `' + config.prefix + 'help ' + response.command.data.name + '`').then((Msg) => {
          let deleteMsg = function() {
            Msg.delete()
          }
          setTimeout(deleteMsg, 10000)
        })
      } else if (response.type == 'error') {
        for (let id of config.master) {
          bot.fetchUser(id).then((user) => {
            console.error(handlers.logger.error(new Date(), response.command.toUpperCase()), response.err.stack)
            user.send('**ERROR! (' + response.command.toUpperCase() + ')** ```js\n' + response.err.stack + '```')
          })
        }
        msg.channel.send('An unexpected error has accured! This has been automaticly reported to the developers!').then((Msg) => {
          let deleteMsg = function() {
            Msg.delete()
          }
          setTimeout(deleteMsg, 10000)
        })
      }
    }).catch((err) => {
      console.error(err)
      msg.channel.send(':bug: **ERROR!** Please report this to the developers!\n```js\n' + err + '```')
    })
  } else if (config.mode == 'development') {
    let isDm = msg.channel.type == 'dm'
    if (isDm) {
      if (config.master.indexOf(msg.author.id) > -1) {
        handlers.command.execute(msg).then((response) => {
          if (response.type == 'default') {
            msg.channel.send(':no_entry: **' + response.response + '** `' + config.prefix + 'help ' + response.command.data.name + '`').then((Msg) => {
              let deleteMsg = function() {
                Msg.delete()
              }
              setTimeout(deleteMsg, 10000)
            })
          } else if (response.type == 'error') {
            for (let id of config.master) {
              bot.fetchUser(id).then((user) => {
                console.error(handlers.logger.error(new Date(), response.command.toUpperCase()), response.err.stack)
                user.send('**ERROR! (' + response.command.toUpperCase() + ')** ```js\n' + response.err.stack + '```')
              })
            }
            msg.channel.send('An unexpected error has accured! This has been automaticly reported to the developers!').then((Msg) => {
              let deleteMsg = function() {
                Msg.delete()
              }
              setTimeout(deleteMsg, 10000)
            })
          }
        }).catch((err) => {
          console.error(err)
          msg.channel.send(':bug: **ERROR!** Please report this to the developers!\n```js\n' + err + '```')
        })
      }
    } else {
      if (config.devServers.indexOf(msg.guild.id) > -1) {
        handlers.command.execute(msg).then((response) => {
          if (response.type == 'default') {
            msg.channel.send(':no_entry: **' + response.response + '** `' + config.prefix + 'help ' + response.command.data.name + '`').then((Msg) => {
              let deleteMsg = function() {
                Msg.delete()
              }
              setTimeout(deleteMsg, 10000)
            })
          } else if (response.type == 'error') {
            for (let id of config.master) {
              bot.fetchUser(id).then((user) => {
                console.error(handlers.logger.error(new Date(), response.command.toUpperCase()), response.err.stack)
                user.send('**ERROR! (' + response.command.data.name.toUpperCase() + ')** ```js\n' + response.err.stack + '```')
              })
            }
            msg.channel.send('An unexpected error has accured! This has been automaticly reported to the developers!').then((Msg) => {
              let deleteMsg = function() {
                Msg.delete()
              }
              setTimeout(deleteMsg, 10000)
            })
          }
        }).catch((err) => {
          console.error(err)
          msg.channel.send(':bug: **ERROR!** Please report this to the developers!\n```js\n' + err.stack + '```')
        })
      }
    }
  }
})

bot.on('reconnecting', () => {
  console.log(handlers.logger.connect(new Date()) + 'Reconnecting...')
})

bot.on('disconnect', (event) => {
  console.log(handlers.logger.connect(new Date()) + 'Disconnected! (' + event.code + ')')
})

bot.on('resume', (replayed) => {
  console.log(handlers.logger.warn(new Date()) + 'Replayed ' + replayed + ' event(s)')
})

bot.on('warn', (info) => {
  console.log(handlers.logger.warn(new Date()) + info)
})

bot.on('debug', (info) => {
  if (config.mode == 'development') {
     console.log(handlers.logger.debug(new Date()) + info)
  }
})

//WebServer Stats
bot.on('guildMemberAvailable', () => {
  webServer.updateStats()
})

//Leave/Join messages
bot.on('guildMemberAdd', (member) => {
  webServer.updateStats()

  if (handlers) {
    handlers.guild.join(member)
  }
})

bot.on('guildMemberRemove', (member) => {
  if (handlers) {
    handlers.guild.leave(member)
  }
})

bot.on('guildAdd', () => {
  webServer.updateStats()
})

bot.on('channelCreate', () => {
  webServer.updateStats()
})
