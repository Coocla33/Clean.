//Load NODE MODULES
const fs = require('fs')
const path = require('path')
const webServer = require('../web/server.js')

//Setup main Variables
var stats = {'usage': 0}

//Load export
exports.load = function() {
  return new Promise((resolve, reject) => {
    try {
    
      //Setup variables
      var commands = {'all': {}, 'list': {}, 'array': []}
      let directories = fs.readdirSync(__dirname + '/../commands/')
      
      //For every Directory Object of directories
      for (let directoryObject of directories) {
      
        //Setup variables
        let commandFiles = fs.readdirSync(__dirname + '/../commands/' + directoryObject)
        
        /For every commandFile of commandFiles
        for (let commandFile of commandFiles) {
        
          //If commandFile is a .js file
          if (commandFile.endsWith('.js')) {
          
            //If this directory is not yet created/used
            if (!commands.all[directoryObject]) {
              commands.all[directoryObject] = {}
            }
            
            //Try, so when a command failes to load you can warn the user.
            try {
            
              //Setup variables
              let command = require(__dirname + '/../commands/' + directoryObject + '/' + commandFile)
              
              //Add command Data inside the commands variables
              commands.all[directoryObject][commandFile.slice(0, -3).toLowerCase()] = command
              commands.list[commandFile.slice(0, -3).toLowerCase()] = {'name': commandFile.slice(0, -3).toLowerCase(), 'type': directoryObject}
              commands.array.push(commandFile.slice(0, -3))
              
              //If the command has aliases
              if (command.data.aliases) {
              
                //Setup aliases with a for loop
                for (let alias of command.data.aliases) {
                  commands.list[alias] = {'name': commandFile.slice(0, -3).toLowerCase(), 'type': directoryObject}
                }
              }
              
            //Error handeling
            } catch(err) {
              console.log(handlers.logger.warn(new Date()) + 'Failed to load ' + commandFile.slice(0, -3).toLowerCase() + ' command. (' + err + ')')
            }
          }
        }
      }
       
      //Set global commands
      global.commands = commands
      resolve(commands)
      
    //Error Handleing
    } catch(err) {
      reject(err)
    }
  })
}

//Reload export
exports.reload = function(command) {
  return new Promise((resolve, reject) => {
  
    //Force lowercase
    command = command.toLowerCase()
    
    //Check if the command exists
    if (commands.list[command]) {
    
      //Try for error handeling if there is an error inside the command itself
      try {
      
        //Get the old command
        let oldCommand = {'all': commands.all[commands.list[command].type][commands.list[command].name], 'list': commands.list[command]}
        
        //delete cache of old command
        delete require.cache[path.join(__dirname, '..', 'commands', oldCommand.list.type, oldCommand.list.name + '.js')]
        
        //Require new command file
        let newCommand = require(__dirname + '/../commands/' + oldCommand.list.type + '/' + oldCommand.list.name + '.js')
        
        //Delete old command
        delete commands.list[command]
        delete commands.all[oldCommand.list.type][oldCommand.list.name]
        delete commands.array[command]
        
        //Check if oldCommand had aliases
        if (oldCommand.all.data.aliases) {
        
          //Using a for loop remove old aliases from the global commands variable
          for (let alias of oldCommand.all.data.aliases) {
            delete commands.list[alias]
          }
        }
        
        //Set new command
        commands.all[oldCommand.list.type][oldCommand.list.name] = newCommand
        commands.list[oldCommand.list.name] = {'name': oldCommand.list.name, 'type': oldCommand.list.type}
        
        //Check if new command has aliases
        if (newCommand.data.aliases) {
        
          //With a for loop add the new aliases to the global commands variable
          for (let alias of newCommand.data.aliases) {
            commands.list[alias] = {'name': oldCommand.list.name, 'type': oldCommand.list.type}
          }
        }
        
      //Error handeling
      } catch(err) {
        reject(err)
      }
    } else {
      
      //Say the command does not exist to the user
      reject('Command Does Not Exist')
    }
    
    //Error handeling
    resolve('Reloaded')
  })
}

//Execute export
exports.execute = function(msg) {
  return new Promise((resolve, reject) => {
    try {
      
      //Check dm
      let isDm = msg.channel.type == 'dm'
      if (isDm) {
      
        //Check if the message starts with config.prefix because dm
        if (msg.content.startsWith(config.prefix)) {
        
          //Setup variables
          let suffix = msg.content.substr(config.prefix.length).substr(msg.content.substr(config.prefix.length).split(' ')[0].length + 1)
          let command = msg.content.substr(config.prefix.length).split(' ')[0].toLowerCase()
          data.suffix = suffix
          
          //Check if the command exists
          if (commands.list[command]) {
          
            //Again check if the message is in DM? (Should be removed)
            if (isDm) {
            
              //Check if the command is enabled in DM
              if (commands.all[commands.list[command].type][commands.list[command].name].data.dm) {
              
                //Check if the command is a developer command
                if (commands.list[command].type == 'developer') {
                
                  //Check if the user is inside the master user Array of the config.json file
                  if (config.master.indexOf(msg.author.id) > -1) {
                    
                    //Run command
                    preCommand(msg, command, isDm).then((response) => {
                      resolve(response)
                    }).catch((err) => {
                      resolve({'type': 'error', 'err': err, 'command': command})
                    })
                    
                  //Error Handleing
                  } else {
                    resolve({'type': 'default', 'response': 'No Acces', 'command': command})
                  }
                } else {
                
                  //Run command
                  preCommand(msg, command, isDm).then((response) => {
                    resolve(response)
                  }).catch((err) => {
                    resolve({'type': 'error', 'err': err, 'command': command})
                  })
                }
                
              //Error handleing
              } else {
                resolve({'type': 'default', 'response': 'DM Disabled', 'command': command})
              }
            
            //THIS SHOULD ALL BE DELETED WUDUFU
            } else {
              if (commands.list[command].type == 'developer') {
                if (config.master.indexOf(msg.author.id) > -1) {
                  preCommand(msg, command, isDm).then((response) => {
                    resolve(response)
                  }).catch((err) => {
                    resolve({'type': 'error', 'err': err, 'command': command})
                  })
                } else {
                  resolve({'type': 'default', 'response': 'No Acces', 'command': command})
                }
              } else {
                preCommand(msg, command, isDm).then((response) => {
                  resolve(response)
                }).catch((err) => {
                  resolve({'type': 'error', 'err': err, 'command': command})
                })
              }
            }
          }
        }
      } else {
        
        //Get guild object
        handlers.data.guild.get(msg.guild).then((guild) => {
        
          //Check if msg starts with the guild prefix.
          if (msg.content.startsWith(guild.settings.prefix)) {
            let suffix = msg.content.substr(guild.settings.prefix.length).substr(msg.content.substr(guild.settings.prefix.length).split(' ')[0].length + 1)
            let command = msg.content.substr(guild.settings.prefix.length).split(' ')[0].toLowerCase()
            data.suffix = suffix
            data.guild = guild
            if (commands.list[command]) {
              if (isDm) {
                if (commands.all[commands.list[command].type][commands.list[command].name].data.dm) {
                  if (commands.list[command].type == 'developer') {
                    if (config.master.indexOf(msg.author.id) > -1) {
                      preCommand(msg, command, isDm).then((response) => {
                        resolve(response)
                      }).catch((err) => {
                        resolve({'type': 'error', 'err': err, 'command': command})
                      })
                    } else {
                      resolve({'type': 'default', 'response': 'No Acces', 'command': command})
                    }
                  } else {
                    preCommand(msg, command, isDm).then((response) => {
                      resolve(response)
                    }).catch((err) => {
                      resolve({'type': 'error', 'err': err, 'command': command})
                    })
                  }
                } else {
                  resolve({'type': 'default', 'response': 'DM Disabled', 'command': command})
                }
              } else {
                if (commands.list[command].type == 'developer') {
                  if (config.master.indexOf(msg.author.id) > -1) {
                    preCommand(msg, command, isDm).then((response) => {
                      resolve(response)
                    }).catch((err) => {
                      resolve({'type': 'error', 'err': err, 'command': command})
                    })
                  } else {
                    resolve({'type': 'default', 'response': 'No Acces', 'command': command})
                  }
                } else {
                  preCommand(msg, command, isDm).then((response) => {
                    resolve(response)
                  }).catch((err) => {
                    resolve({'type': 'error', 'err': err, 'command': command})
                  })
                }
              }
            }
          }
        }).catch((err) => {
          if (err == 'Guild Does Not Exist') {
            handlers.data.guild.new(msg.guild).then(() => {
              exports.execute(msg)
            }).catch((err) => {
              resolve({'type': 'error', 'err': err, 'command': 'Data Handler'})
            })
          } else {
            resolve({'type': 'error', 'err': err, 'command': 'Data Handler'})
          }
        })
      }
    } catch(err) {
      resolve({'type': 'error', 'err': err, 'command': command})
    }
  })
}

let checkPerms = function(msg, perms) {
  let userMissing = {'type': 'user', 'array': []}
  let botMissing = {'type': 'bot', 'array': []}
  for (let perm of perms) {
    if (!msg.channel.permissionsFor(msg.author).has(perm)) {
      userMissing.array.push(perm)
    }
    if (!msg.channel.permissionsFor(bot.user).has(perm)) {
      botMissing.array.push(perm)
    }
  }
  if (userMissing.array.length > 0) {
    return {'msg': 'User Has No Perms (' + userMissing.array.join(', ') + ')', 'status': false}
  } else if (botMissing.array.length > 0) {
    return {'msg': 'Bot Has No Perms (' + botMissing.array.join(', ') + ')', 'status': false}
  } else {
    return {'status': true}
  }
}

let preCommand = function(msg, command, isDm) {
  return new Promise((resolve, reject) => {
    if (isDm) {
      executeCommand(msg, command, data).then((response) => {
        resolve(response)
      }).catch((err) => {
        reject(err)
      })
    } else {
      if (commands.all[commands.list[command].type][commands.list[command].name].data.permissions) {
        let permCheck = checkPerms(msg, commands.all[commands.list[command].type][commands.list[command].name].data.permissions)
        if (permCheck.status) {
          executeCommand(msg, command, data).then((response) => {
            resolve(response)
          }).catch((err) => {
            reject(err)
          })
        } else {
          resolve({'type': 'default', 'response': permCheck.msg, 'command': command})
        }
      } else {
        executeCommand(msg, command, data).then((response) => {
          resolve(response)
        }).catch((err) => {
          reject(err)
        })
      }
    }
  })
}

let executeCommand = function(msg, command) {
  return new Promise((resolve, reject) => {
    data.usage = data.usage + 1
    console.log(handlers.logger.info(new Date()) + msg.author.username + '#' + msg.author.discriminator + ' used the following command: [' + msg.content.substr(config.prefix.length) + ']')
    webServer.updateStats()
    commands.all[commands.list[command].type][commands.list[command].name].run(msg, data).then((response) => {
      resolve({'type': 'default', 'response': response, 'command': command})
    }).catch((err) => {
      reject(err)
    })
  })
}
