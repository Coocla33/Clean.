exports.data = {
  'name': 'Info',
  'desc': 'Showing some basic bot analytics.',
  'usage': 'info',
  'dm': true
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {

    //Create embed
    let embed = {
      'color': handlers.misc.embedColor(msg),
      'timestamp': new Date(),
      'footer': {
        'text': '© Clean.'
      },
      'description':
        '► **' + bot.guilds.size + '** Guilds.\n' +
        '► **' + bot.users.size + '** Users.\n' +
        '► **' + bot.channels.size + '** Channels.\n' +
        '► **' + handlers.misc.msToRead(bot.uptime) + '** Uptime.\n'
    }

    //Send embed with small message
    msg.channel.send(':gear: **Clean. Bot Analytics.**', {embed}).catch((err) => {reject(err)})
  })
}
