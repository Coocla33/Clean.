exports.data = {
  'name': 'ToggleGreeting',
  'aliases': ['tg'],
  'desc': 'Toggle the greeting setting',
  'usage': 'togglegreeting [join, leave]',
  'new': false,
  'indev': true,
  'note': 'Not defining join or leave, will toggle them both!',
  'permissionsUser': ['ADMINISTRATOR'],
  'permissionsBot': ['SEND_MESSAGES']
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {

    //Setup variables
    let toggle = {'leave': true, 'join': true}
    let toggled = []
    let messageArray = []

    //Check settings
    if (!data.guild.settings.greeting) {
      data.guild.settings.greeting = {
        'join': {
          'enable': false,
          'channel': msg.guild.defaultChannel.id,
          'message': 'Welcome, **${user_name}** to **${guild_name}**! You are the **${user_join_count}** user.'
        },
        'leave': {
          'enable': false,
          'channel': msg.guild.defaultChannel.id,
          'message': '**${user_name}** left **${guild_name}**... :('
        }
      }
    }

    //Check suffix
    switch(data.suffix.toLowerCase()) {

      //Suffix == leave
      case 'leave':
        toggle.join = false
        break

      //Suffix == join
      case 'join':
        toggle.leave = false
        break
    }

    //Change settings
    for (let i in toggle) {
      if (toggle[i]) {
        data.guild.settings.greeting[i].enable = !data.guild.settings.greeting[i].enable
        toggled.push('**► ' + i + ':** ' + data.guild.settings.greeting[i].enable)
      }
    }

    //Update guilddObject
    handlers.data.guild.update(msg.guild, data.guild).then((guild) => {

      //Create Embed
      let embed = {
        'description': toggled.join('\n'),
        'color': handlers.misc.embedColor(msg),
        'timestamp': new Date(),
        'footer': {
          'text': '© Clean.'
        }
      }

      //Send embed
      msg.channel.send(':tada: **Updated!**', {embed})
    })
  })
}
