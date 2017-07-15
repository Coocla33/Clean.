exports.data = {
  'name': 'Help',
  'aliases': ['?', 'cmds'],
  'desc': 'Giving you a helping hand!',
  'usage': 'help [command]',
  'dm': true
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {

    //Check if suffix
    if (data.suffix) {

      //Check if lowercase suffix is a command/allias
      if (commands.list[data.suffix.toLowerCase()]) {

        //Check if the command is not unlisted
        if (commands.list[data.suffix.toLowerCase()].type != 'unlisted') {

          //Setup variables
          //Get command METADATA
          let command = commands.all[commands.list[data.suffix.toLowerCase()].type][commands.list[data.suffix.toLowerCase()].name].data
          let messageArray = []

          //Description
          messageArray.push('__**Description**__')
          messageArray.push('*' + command.desc + '*\n')

          //Usage
          messageArray.push('__**Usage**__\n`' + data.guild.settings.prefix + command.usage + '`\n')

          //DM
          if (command.dm) {
            messageArray.push('► Usable in **DM**.')
          }

          //Aliases
          if (command.aliases && command.aliases.length > 0) {
            messageArray.push('► Aliases: `' + command.aliases.join('`, `') + '`')
          }

          //Permissions
          if (command.permissionsUser && command.permissionsUser.length > 0) {
            messageArray.push('► User Permissions: `' + command.permissionsUser.join('`, `') + '`')
          }

          if (command.permissionsBot && command.permissionsBot.length > 0) {
            messageArray.push('► Bot Permissions: `' + command.permissionsBot.join('`, `') + '`')
          }

          if (command.permissions && command.permissions.length > 0) {
            messageArray.push('► Permissions: `' + command.permissions.join('`, `') + '`')
          }

          //Note
          if (command.note) {
            messageArray.push('\n__**Additional Note**__\n' + command.note)
          }

          //Create embed
          let embed = {
            'description': messageArray.join('\n'),
            'color': handlers.misc.embedColor(msg),
            'timestamp': new Date(),
            'footer': {
              'text': '(required) [optional] © Clean.'
            }
          }

          //Send embed
          msg.channel.send(':grey_question: **' + command.name + '**', {embed}).catch((err) => {reject(err)})
        } else {

          //Error Handleing
          resolve('Command Is Unlisted')
        }
      } else {

        //Error Handleing
        resolve('Command Does Not Exist')
      }

    //If no command is defined
    } else {

      //Create embed
      let embed = {
        'title': 'Clean. Command list.',
        'description': 'For more info on a specific command, please type `' + config.prefix + 'help [command]`',
        'color': 0xFFFFFF,
        'timestamp': new Date(),
        'footer': {
          'text': '© Clean.'
        },
        'fields': []
      }

      //Go trough each type of command
      for (let type in commands.all) {

        //Check if the current user is a master user
        if (config.master.indexOf(msg.author.id) > -1) {

          //If master user show all commands except for unlisted.
          if (type != 'unlisted') {

            //Setup variables
            let length = 0
            let list = []

            //For each command of the current type add it to the list array and add 1 to the length variable
            for (let command in commands.all[type]) {
              length++
              list.push('├ ' + commands.all[type][command].data.name)
            }

            //If there are more then 1 commands
            if (length > 1) {

              //Change the first and the last prefix of the string in the array of this type
              list[0] = '┌ ' + commands.all[type][list[0].toLowerCase().split(' ')[1]].data.name
              list[list.length - 1] = '└ ' + commands.all[type][list[list.length - 1].toLowerCase().split(' ')[1]].data.name
            } else {

              //Change the prefix of the single string in the array of this type
              list[0] = '─ ' + commands.all[type][list[0].toLowerCase().split(' ')[1]].data.name
            }

            //Push the array to the embed
            embed.fields.push({'inline': true, 'name': type + ' (' + list.length + ')', 'value': list.join('\n')})
          }

        //If user is not a master user
        } else {

          //Check if the type is not developer or unlisted
          if (type != 'developer' && type != 'unlisted') {

            //Setup variables
            let length = 0
            let list = []

            //For each command of the current type add it to the list array and add 1 to the length variable
            for (let command in commands.all[type]) {
              length = length + 1
              list.push('├ ' + commands.all[type][command].data.name)
            }
            if (length > 1) {

              //Change the first and the last prefix of the string in the array of this type
              list[0] = '┌ ' + commands.all[type][list[0].toLowerCase().split(' ')[1]].data.name
              list[list.length - 1] = '└ ' + commands.all[type][list[list.length - 1].toLowerCase().split(' ')[1]].data.name
            } else {

              //Change the prefix of the single string in the array of this type
              list[0] = '─ ' + commands.all[type][list[0].toLowerCase().split(' ')[1]].data.name
            }

            //Push the array to the embed
            embed.fields.push({'inline': true, 'name': type + ' (' + list.length + ')', 'value': list.join('\n')})
          }
        }
      }

      //Send embed in direct messages
      msg.author.send('', {embed}).then(() => {

        //Send msg in channel.
        msg.channel.send(':mailbox_with_mail: **You have mail!**')
      }).catch((err) => {

        //Bot not able to send message in direct messages so sending in channel
        msg.channel.send('', {embed}).catch((err) => {reject(err)})
      })
    }
  })
}
