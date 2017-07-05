exports.data = {
  'name': 'Invite',
  'desc': 'Invite Clean.!',
  'usage': 'invite',
  'dm': true,
  'new': true
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
      '► [Bot Invite](https://discordapp.com/oauth2/authorize?client_id=305821126083215380&scope=bot)\n' +
      '► [Support Server](https://discordapp.com/invite/XUjxMEv)\n' +
      '► [Patreon](https://www.patreon.com/Coocla33)\n' +
      '► [GitHub](https://github.com/Coocla33/Clean.)'
    }

    //Send embed
    msg.channel.send(':link: **Clean. Links.**', {embed}).catch((err) => {reject(err)})
  })
}
