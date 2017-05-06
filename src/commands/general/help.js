exports.data = {
  'name': 'Help',
  'aliases': ['?', 'cmds'],
  'desc': 'Giving you a helping hand!',
  'usage': 'help [command]',
  'dm': true
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    if (data.suffix) {
      if (commands.list[data.suffix.toLowerCase()]) {
        if (commands.list[data.suffix.toLowerCase()].type != 'unlisted') {
          let command = commands.all[commands.list[data.suffix.toLowerCase()].type][commands.list[data.suffix.toLowerCase()].name].data
          let embed = {
            'title': command.name,
            'description': command.desc,
            'color': handlers.misc.embedColor(msg),
            'timestamp': new Date(),
            'footer': {
              'text': '(required) [optional] © Clean.'
            },
            'fields': [
              {
                'name': 'Usage',
                'value': '`' + command.usage + '`'
              }
            ]
          }
          if (command.dm) {
            embed.fields.push({'name': 'Aliases', 'value': command.dm})
          }
          if (command.aliases && command.aliases.length > 0) {
            embed.fields.push({'name': 'Aliases', 'value': '`' + command.aliases.join('`,`') + '`'})
          }
          if (command.permissions && command.permissions.length > 0) {
            embed.fields.push({'name': 'Permissions', 'value': '`' + command.permissions.join('`,`') + '`'})
          }
          if (command.note) {
            embed.fields.push({'name': 'Additional Notes', 'value': command.note})
          }
          msg.channel.send('', {embed}).catch((err) => {reject(err)})
        } else {
          resolve('Command Is Unlisted')
        }
      } else {
        resolve('Command Does Not Exist')
      }
    } else {
      let embed = {
        'title': 'Clean. Command list.',
        'description': 'For more info on a specific command, please type `' + config.prefix + 'help [command]`',
        'color': handlers.misc.embedColor(msg),
        'timestamp': new Date(),
        'footer': {
          'text': '© Clean.'
        },
        'fields': []
      }
      for (let type in commands.all) {
        if (config.master.indexOf(msg.author.id) > -1) {
          let length = 0
          let list = []
          for (let command in commands.all[type]) {
            length = length + 1
            list.push('├ ' + commands.all[type][command].data.name)
          }
          if (length > 1) {
            for (let i in list) {
              if (i == 0) {
                list[i] = '┌ ' + commands.all[type][list[i].toLowerCase().split(' ')[1]].data.name
              } else if (i == length - 1) {
                list[i] = '└ ' + commands.all[type][list[i].toLowerCase().split(' ')[1]].data.name
              }
            }
          } else {
            list[0] = '─ ' + commands.all[type][list[0].toLowerCase().split(' ')[1]].data.name
          }
          embed.fields.push({'inline': true, 'name': type + ' (' + list.length + ')', 'value': list.join('\n')})
        } else {
          if (type != 'developer' && type != 'unlisted') {
            let length = 0
            let list = []
            for (let command in commands.all[type]) {
              length = length + 1
              list.push('├ ' + commands.all[type][command].data.name)
            }
            if (length > 1) {
              for (let i in list) {
                if (i == 0) {
                  list[i] = '┌ ' + commands.all[type][list[i].toLowerCase().split(' ')[1]].data.name
                } else if (i == length - 1) {
                  list[i] = '└ ' + commands.all[type][list[i].toLowerCase().split(' ')[1]].data.name
                }
              }
            } else {
              list[0] = '─ ' + commands.all[type][list[0].toLowerCase().split(' ')[1]].data.name
            }
            embed.fields.push({'inline': true, 'name': type + ' (' + list.length + ')', 'value': list.join('\n')})
          }
        }
      }
      msg.channel.send('', {embed}).catch((err) => {reject(err)})
    }
  })
}
