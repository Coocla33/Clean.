const usage = require('usage')

exports.data = {
  'name': 'Info',
  'desc': 'Showing some basic bot information.',
  'usage': 'info [full]',
  'dm': true,
  'permissions': []
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    if (data.suffix && data.suffix.toLowerCase() == 'full') {
      usage.lookup(process.pid, function(err, result) {
        let embed = {
          'title': 'Clean. Basic Information',
          'description': 'Full information about Clean.',
          'color': handlers.misc.embedColor(msg),
          'timestamp': new Date(),
          'footer': {
            'text': '© Clean.'
          },
          'fields': [
            {
              'inline': true,
              'name': 'Guild Count',
              'value': '`' + bot.guilds.size + '`'
            }, {
              'inline': true,
              'name': 'User Count',
              'value': '`' + bot.users.size + '`'
            }, {
              'inline': true,
              'name': 'Channel Count',
              'value': '`' + bot.channels.size + '`'
            }, {
              'inline': true,
              'name': 'Command Usage',
              'value': '`' + data.usage + '`'
            }, {
              'inline': true,
              'name': 'RAM Usage',
              'value': '`' + (result.memory / 1024 / 1024).toFixed(2) + 'mb`'
            }, {
              'inline': true,
              'name': 'CPU Usage',
              'value': '`' + (result.cpu).toFixed(2) + '%`'
            }, {
              'inline': false,
              'name': 'Uptime',
              'value': '`' + handlers.misc.msToRead(bot.uptime) + '`'
            }
          ]
        }
        msg.channel.send('', {embed}).catch((err) => {reject(err)})
      })
    } else {
      let embed = {
        'title': 'Clean. Basic Information',
        'description': 'For more, detailed information. Please type `' + config.prefix + 'info full`',
        'color': handlers.misc.embedColor(msg),
        'timestamp': new Date(),
        'footer': {
          'text': '© Clean.'
        },
        'fields': [
          {
            'inline': true,
            'name': 'Guild Count',
            'value': '`' + bot.guilds.size + '`'
          }, {
            'inline': true,
            'name': 'User Count',
            'value': '`' + bot.users.size + '`'
          }, {
            'inline': true,
            'name': 'Channel Count',
            'value': '`' + bot.channels.size + '`'
          }, {
            'inline': false,
            'name': 'Uptime',
            'value': '`' + handlers.misc.msToRead(bot.uptime) + '`'
          }
        ]
      }
      msg.channel.send('', {embed}).catch((err) => {reject(err)})
    }
  })
}
