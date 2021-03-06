exports.data = {
  'name': 'Test',
  'desc': 'Test code',
  'usage': 'test [dunnno, might be something here? help]',
  'dm': true
}

const path = require('path')

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    if (msg.member.voiceChannel) {
      msg.member.voiceChannel.join().then((connection) => {
        if (connection.speaking) {
          msg.channel.send('I am already playing a sound in this channel!')
        } else {
          let files = ['airhorn.mp3', 'monsterkill.mp3', 'trol.mp3', 'applause.mp3', 'nigger.mp3', 'scream.mp3']
          let final = files[Math.floor(Math.random() * files.length)]
          if (data.suffix) {
            msg.channel.send(data.suffix.toLowerCase() + '.mp3')
            if (files.indexOf(data.suffix.toLowerCase() + '.mp3') > -1) {
              final = data.suffix.toLowerCase() + '.mp3'
            }
          }
          const dispatcher = connection.playFile(srcDirectory + '/sounds/' + final)
          dispatcher.on('end', () => {
            connection.disconnect()
          })
        }
      })
    }
  })
}
