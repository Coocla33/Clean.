const fs = require('fs')
const path = require('path')

var stats = {'usage': 0}

exports.load = function() {
  return new Promise((resolve, reject) => {
    try {
      var commands = {'all': {}, 'list': {}, 'array': []}
      let directories = fs.readdirSync(__dirname + '/../commands/')
      for (let directoryObject of directories) {
        let commandFiles = fs.readdirSync(__dirname + '/../commands/' + directoryObject)
        for (let commandFile of commandFiles) {
          if (commandFile.endsWith('.js')) {
            if (!commands.all[directoryObject]) {
              commands.all[directoryObject] = {}
            }
            let command = require(__dirname + '/../commands/' + directoryObject + '/' + commandFile)
            commands.all[directoryObject][commandFile.slice(0, -3).toLowerCase()] = command
            commands.list[commandFile.slice(0, -3).toLowerCase()] = {'name': commandFile.slice(0, -3).toLowerCase(), 'type': directoryObject}
            commands.array.push(commandFile.slice(0, -3))
            if (command.data.aliases) {
              for (let alias of command.data.aliases) {
                commands.list[alias] = {'name': commandFile.slice(0, -3).toLowerCase(), 'type': directoryObject}
              }
            }
          }
        }
      }
      global.commands = commands
      resolve(commands)
    } catch(err) {
      reject(err)
    }
  })
}

exports.reload = function(command) {
  return new Promise((resolve, reject) => {
    command = command.toLowerCase()
    if (commands.list[command]) {
      try {
        let oldCommand = {'all': commands.all[commands.list[command].type][commands.list[command].name], 'list': commands.list[command]}
        delete require.cache[path.join(__dirname, '..', 'commands', oldCommand.list.type, oldCommand.list.name + '.js')]
        let newCommand = require(__dirname + '/../commands/' + oldCommand.list.type + '/' + oldCommand.list.name + '.js')
        delete commands.list[command]
        delete commands.all[oldCommand.list.type][oldCommand.list.name]
        delete commands.array[command]
        if (oldCommand.all.data.aliases) {
          for (let alias of oldCommand.all.data.aliases) {
            delete commands.list[alias]
          }
        }
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

exports.execute = function(msg) {
  return new Promise((resolve, reject) => {
    try {
      let isDm = msg.channel.type == 'dm'
      if (isDm) {
        if (msg.content.startsWith(config.prefix)) {
          let suffix = msg.content.substr(config.prefix.length).substr(msg.content.substr(config.prefix.length).split(' ')[0].length + 1)
          let command = msg.content.substr(config.prefix.length).split(' ')[0].toLowerCase()
          data.suffix = suffix
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
      } else {
        handlers.data.guild.get(msg.guild).then((guild) => {
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
    commands.all[commands.list[command].type][commands.list[command].name].run(msg, data).then((response) => {
      resolve({'type': 'default', 'response': response, 'command': command})
    }).catch((err) => {
      reject(err)
    })
  })
}
