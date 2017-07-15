
//Setup node modules
const fs = require('fs')
const path = require('path')
const webServer = require('../web/server.js')

//Setup basic variables
let stats = {'usage': 0}

//Export load function
exports.load = function() {
  return new Promise((resolve, reject) => {
    try {

      //Setup variables
      let commands = {'all': {}, 'list': {}, 'array': []}
      let directories = fs.readdirSync(__dirname + '/../commands/')

      //For every directory object of directories
      for (let directoryObject of directories) {

        //Setup commandFiles array for every directoryObject
        let commandFiles = fs.readdirSync(__dirname + '/../commands/' + directoryObject)

        //For every commandfile
        for (let commandFile of commandFiles) {

          //Check if commandFile is a javascript file
          if (commandFile.endsWith('.js')) {

            //Setup commands.all variable
            if (!commands.all[directoryObject]) {
              commands.all[directoryObject] = {}
            }

            try {

              //Require command
              let command = require(__dirname + '/../commands/' + directoryObject + '/' + commandFile)

              //Setup command inside the commands variable
              commands.all[directoryObject][commandFile.slice(0, -3).toLowerCase()] = command
              commands.list[commandFile.slice(0, -3).toLowerCase()] = {'name': commandFile.slice(0, -3).toLowerCase(), 'type': directoryObject}
              commands.array.push(commandFile.slice(0, -3).toLowerCase())

              //Setup aliases if any
              if (command.data.aliases) {

                //For every alias
                for (let alias of command.data.aliases) {
                  commands.list[alias] = {'name': commandFile.slice(0, -3).toLowerCase(), 'type': directoryObject}
                }
              }

            //Error Handleing
            } catch(err) {
              reject(err)
            }
          }
        }
      }

      //Make commands a global variable
      global.commands = commands
      resolve(commands)

    //Error Handleing
    } catch(err) {
      reject(err)
    }
  })
}

//export reload function
exports.reload = function(command) {
  return new Promise((resolve, reject) => {

    //Lowercase command
    command = command.toLowerCase()

    //Check if command exists
    if (commands.list[command]) {
      try {

        //Get old command
        let oldCommand = {'all': commands.all[commands.list[command].type][commands.list[command].name], 'list': commands.list[command]}

        //Delete cache of require function
        delete require.cache[path.join(__dirname, '..', 'commands', oldCommand.list.type, oldCommand.list.name + '.js')]

        //Require new command
        let newCommand = require(__dirname + '/../commands/' + oldCommand.list.type + '/' + oldCommand.list.name + '.js')

        //Delete old command data
        delete commands.list[command]
        delete commands.all[oldCommand.list.type][oldCommand.list.name]
        delete commands.array[command]

        //Check of old aliases and delete them
        if (oldCommand.all.data.aliases) {
          for (let alias of oldCommand.all.data.aliases) {
            delete commands.list[alias]
          }
        }

        //Setup new command
        commands.all[oldCommand.list.type][oldCommand.list.name] = newCommand
        commands.list[oldCommand.list.name] = {'name': oldCommand.list.name, 'type': oldCommand.list.type}
        if (newCommand.data.aliases) {
          for (let alias of newCommand.data.aliases) {
            commands.list[alias] = {'name': oldCommand.list.name, 'type': oldCommand.list.type}
          }
        }
      } catch(err) {
        reject(err)
      }
    } else {
      reject('Command Does Not Exist')
    }
    resolve('Reloaded')
  })
}

//export execute function
exports.execute = function(msg) {
  return new Promise((resolve, reject) => {
    try {

      //Setup check variables
      let isDm = msg.channel.type == 'dm'
      let isMaster = config.master.indexOf(msg.author.id)


      //Check if msg is a dm message
      if (isDm) {

        //Check if message starts with prefix
        if (msg.content.startsWith(config.prefix)) {

          //Setup basic variables
          let commandName = msg.content.substr(config.prefix.length).split(' ')[0].toLowerCase()

          //Check if command is valid
          if (commands.list[commandName]) {

            //Setup command variable
            let command = commands.all[commands.list[commandName].type][commands.list[commandName].name]

            //Check if command is a developer only command
            if (commands.list[commandName].type == 'developer') {

              //Check if user is a master user using the isMaster variable
              if (isMaster > -1) {

                //Execute preCommand
                preCommand(msg, command, undefined).then((response) => {
                  resolve(response)
                }).catch((err) => {
                  reject(err)
                })
              } else {

                //No acces to command
                resolve({'type': 'default', 'response': 'No Acces', 'command': command})
              }
            } else {

              //Execute preCommand
              preCommand(msg, command, undefined).then((response) => {
                resolve(response)
              }).catch((err) => {
                reject(err)
              })
            }
          }
        }
      } else {

        //Get guild object
        handlers.data.guild.get(msg.guild).then((guild) => {

          //Check if message starts with prefix
          if (msg.content.startsWith(guild.settings.prefix)) {

            //Setup basic variables
            let commandName = msg.content.substr(guild.settings.prefix.length).split(' ')[0].toLowerCase()

            //Check if command is valid
            if (commands.list[commandName]) {

              //Setup command variable
              let command = commands.all[commands.list[commandName].type][commands.list[commandName].name]

              //Check if command is a developer only command
              if (commands.list[commandName].type == 'developer') {

                //Check if user is a master user using the isMaster variable
                if (isMaster > -1) {

                  //Execute preCommand
                  preCommand(msg, command, guild).then((response) => {
                    resolve(response)
                  }).catch((err) => {
                    reject(err)
                  })
                } else {

                  //No acces to command
                  resolve({'type': 'default', 'response': 'No Acces', 'command': command})
                }
              } else {

                //Execute preCommand
                preCommand(msg, command, guild).then((response) => {
                  resolve(response)
                }).catch((err) => {
                  reject(err)
                })
              }
            }
          }
        }).catch((err) => {
          if (err == 'Guild Does Not Exist') {
            handlers.data.guild.new(msg.guild).then(() => {
              exports.execute(msg)
            })
          }
        })
      }

    //Error Handleing
    } catch(err) {
      resolve({'type': 'error', 'err': err, 'command': msg.content.substr(config.prefix.length).split(' ')[0].toLowerCase()})
    }
  })
}

//Function to setup the dataobject per command
function setupData(msg, command, guild, callback) {

  //Setup variables
  let suffix = ''
  if (guild) {
    suffix = msg.content.substr(guild.settings.prefix.length).substr(msg.content.substr(guild.settings.prefix.length).split(' ')[0].length + 1)
  } else {
    suffix = msg.content.substr(config.prefix.length).substr(msg.content.substr(config.prefix.length).split(' ')[0].length + 1)
  }
  data = {}

  //Check if command needs user object
  if (command.data.userObjectRequired) {

    //Get user object
    handlers.data.user.get(msg.author).then((user) => {

      //Setup final data object
      data.user = user
      data.suffix = suffix
      data.guild = guild
      data.usage = stats.usage

      //callback
      callback(data)
    }).catch((err) => {

      //No user object
      if (err == 'User Does Not Exist') {
        handlers.data.user.new(msg.author).then((user) => {

          //Setup final data object
          data.user = user
          data.suffix = suffix
          data.guild = guild
          data.usage = stats.usage

          //callback
          callback(data)
        })
      }
    })
  } else {

    //Setup final data object
    data.suffix = suffix
    data.guild = guild
    data.usage = stats.usage

    //callback
    callback(data)
  }
}

function permCheck(msg, userPerms, botPerms) {

  //Setup variables
  let userMissing = {'type': 'user', 'array': []}
  let botMissing = {'type': 'bot', 'array': []}
  let status = {'user': false, 'bot': false}

  //For every permission of userPermissions
  for (let perm of userPerms) {

    //If user does NOT have perm
    if (msg.guild && !msg.channel.permissionsFor(msg.author).has(perm)) {
      userMissing.array.push(perm)
    }

    //If user is missing more then 0 perms
    if (userMissing.array.length > 0) {
      return {'msg': 'User Has No Perms (' + userMissing.array.join(', ') + ')', 'status': false}
    } else {

      //User has perms
      status.user = true
    }
  }

  for (let perm of botPerms) {

    //If bot does NOT have perm
    if (msg.guild && !msg.channel.permissionsFor(bot.user).has(perm)) {
      botMissing.array.push(perm)
    }

    if (botMissing.array.length > 0) {
      return {'msg': 'Bot Has No Perms (' + botMissing.array.join(', ') + ')', 'status': false}
    } else {

      //Bot has perms
      status.bot = true
    }
  }

  //Check status
  if (status.bot == true && status.user == true) {
    return {'status': true}
  }
}

function preCommand(msg, command, guild) {
  return new Promise((resolve, reject) => {

    //Check permissions
    if (command.data.permissionsUser || command.data.permissionsBot) {
      let perm = permCheck(msg, command.data.permissionsUser, command.data.permissionsBot)
      if (perm.status) {

        //Execute Command
        executeCommand(msg, command, guild).then((response) => {
          resolve(response)
        }).catch((err) => {
          reject(err)
        })
      } else {
        resolve({'type': 'default', 'response': perm.msg, 'command': command})
      }
    } else {

      //Execute Command
      executeCommand(msg, command, guild).then((response) => {
        resolve(response)
      }).catch((err) => {
        reject(err)
      })
    }
  })
}

function executeCommand(msg, command, guild) {
  return new Promise((resolve, reject) => {

    //Add 1 to the usage
    stats.usage++

    //Setup data object
    setupData(msg, command, guild, function(data) {

      //Log command usage
      console.log(handlers.logger.info(new Date()) + msg.author.username + '#' + msg.author.discriminator + ' used the following command: [' + msg.content.substr(config.prefix.length) + ']')

      //Update stats of webServer
      webServer.updateStats()

      //Run the command
      command.run(msg, data).then((response) => {
        resolve({'type': 'default', 'response': response, 'command': command})
      }).catch((err) => {
        reject(err)
      })
    })
  })
}
