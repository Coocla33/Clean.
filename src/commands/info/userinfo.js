exports.data = {
  'name': 'UserInfo',
  'aliases': ['user', 'ui'],
  'desc': 'Show all the secret info about an user!',
  'usage': 'userinfo [@mention]',
  'dm': true
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {

    //Setup variables
    let target = {'user': msg.author, 'member': msg.member}
    let title = ''
    let roles = []
    let presence = ''
    let messageArray = []

    //Check mentions
    if (msg.mentions.users.size > 0 && msg.guild) {
      target = {'user': msg.mentions.users.first(), 'member': msg.guild.members.get(msg.mentions.users.first().id)}
    }

    //Setup Title
    if (msg.guild) {
      if (target.member.nickname) {
        title = '**' + target.user.tag + '** *(' + target.member.nickname + ')*'
      } else {
        title = '**' + target.user.tag + '**'
      }
    } else {
      title = '**' + target.user.tag + '**'
    }

    //Setup Roles
    if (msg.guild) {
      for (let role of target.member.roles.array()) {
        if (role.name != '@everyone') {
          roles.push(role.name)
        }
      }
    }

    //Setup Status
    if (target.user.presence.game != null) {
      presence = '► **' + target.user.presence.status.charAt(0).toUpperCase() + target.user.presence.status.slice(1)  + '**. Playing **' + target.user.presence.game.name + '**'
    } else {
      presence = '► **' + target.user.presence.status.charAt(0).toUpperCase() + target.user.presence.status.slice(1) + '**'
    }

    //Id
    messageArray.push('► Id: **' + target.user.id + '**')

    //Bot
    if (target.user.bot) {
      messageArray.push('► **Bot**')
    }

    //Status
    messageArray.push(presence)

    //Account Creation
    messageArray.push('► Account created at: **' + target.user.createdAt.getDate() + '/' + (target.user.createdAt.getMonth() + 1) + '/' + target.user.createdAt.getFullYear() + '**')

    //Guild Joined
    if (msg.guild) {
      messageArray.push('► Guild joined at: **' + target.member.joinedAt.getDate() + '/' + (target.member.joinedAt.getMonth() + 1) + '/' + target.member.joinedAt.getFullYear() + '**')
    }

    //Roles
    if (roles.length > 0) {
      messageArray.push('\n***Roles***\n`' + roles.join('`, `') + '`')
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
    msg.channel.send(':bust_in_silhouette: ' + title, {embed}).catch((err) => {reject(err)})
  })
}
