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
      '► [Bot Invite](http://clean.coocla33.com/invite)\n' +
      '► [Support Server](http://clean.coocla33.com/support)\n' +
      '► [Patreon](https://www.patreon.com/Coocla33)'
    }

    //Send embed
    msg.channel.send(':link: **Clean. Links.**', {embed}).catch((err) => {reject(err)})
  })
}
