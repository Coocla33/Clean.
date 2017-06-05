exports.data = {
  'name': 'ServerInfo',
  'aliases': ['server', 'si'],
  'desc': 'Showing all the information you need about this server!',
  'usage': 'serverinfo [full]',
  'indev': true
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {

    //Setup variables
    let server = msg.guild
    let onlineUsers = 0
    let botCount = 0
    let channels = []
    let roles = []
    let emojis = []
    let messageArray = []

    //Setup Online Users
    server.members.forEach((member) => {

      //Sort trough all users and see if they are online
      if (['online', 'dnd', 'idle'].indexOf(member.presence.status) > -1) {
        onlineUsers++
      }

      //Add 1 to the botcount whenever a bot is seen
      if (member.user.bot) {
        botCount++
      }
    })

    //Id
    messageArray.push('► Id: **' + server.id + '**')

    //Users
    messageArray.push('► Online Users: **' + onlineUsers + '/' + server.members.size + '** *(' + botCount + ' Bots)*')

    //Timeout
    if (server.afkChannelID) {
      messageArray.push('► AFK Settings: **' + server.channels.get(server.afkChannelID).name + '** at **' + server.afkTimeout / 60 + ' Minutes**')
    }

    //Server Creator
    messageArray.push('► Server created by **' + server.owner.user.tag + '**')

    //Created At
    messageArray.push('► Server created on **' + server.createdAt.getDate() + '/' + (server.createdAt.getMonth() + 1) + '/' + server.createdAt.getFullYear() + '**')

    //Full information
    if (data.suffix && data.suffix.toLowerCase() == 'full') {

      //Setup roles
      server.roles.forEach((role) => {

        //Dont use @everyone role
        if (role.name != '@everyone') {
          roles.push(role.name)
        }
      })

      //Setup channels
      server.channels.forEach((channel) => {

        //Dont add default channel
        if (channel.name != server.defaultChannel.name && channel.type == 'text') {
          channels.push(channel.name)
        }
      })

      //Setup emojis
      server.emojis.forEach((emoji) => {

        //Check for permissions
        if (msg.channel.permissionsFor(bot.user).has('EXTERNAL_EMOJIS')) {
          emojis.push('<:' + emoji.name + ':' + emoji.id + '>')
        } else {
          emojis.push(emoji.name)
        }
      })

      //Roles
      if (roles.length > 0) {
        messageArray.push('\n***Roles***\n`' + roles.join('`, `') + '`')
      }

      //Channels
      if (channels.length > 0) {
        messageArray.push('\n***Text Channels***\nDefault Text Channel: **#' + server.defaultChannel.name + '**\n`' + channels.join('`, `') + '`')
      }

      //Emojis
      if (emojis.length > 0) {

        //Check if emoji starts with the discord emoji pattern thingy
        if (emojis[0].startsWith('<:')) {
          messageArray.push('\n***Emojis***\n' + emojis.join(' '))
        } else {
          messageArray.push('\n***Emojis***\n`' + emojis.join('`, `') + '`')
        }
      }
    }

    //Create Embed
    let embed = {
      'description': messageArray.join('\n'),
      'color': handlers.misc.embedColor(msg),
      'timestamp': new Date(),
      'footer': {
        'text': '© Clean.'
      }
    }

    //Send Embed
    msg.channel.send(':satellite: **' + server.name + '**', {embed}).catch((err) => {reject(err)})
  })
}
