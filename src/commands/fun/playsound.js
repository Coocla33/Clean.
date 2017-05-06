exports.data = {
  'name': 'PlaySound',
  'aliases': ['ps'],
  'desc': 'Play a sound inside your voice channel!',
  'usage': 'playsound [sound]',
  'note': 'You need to be inside a Voice Channel to use this command!\nSound list: `Airhorn`, `MonsterKill`, `Troll`, `Applause`, `Nigger`, `Scream`, `TheFuckYouDo`, `MegaFaggot`'
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    if (msg.member.voiceChannel) {
      msg.member.voiceChannel.join().then((connection) => {
        if (connection.speaking) {
          msg.channel.send('I am already playing a sound in this channel!')
        } else {
          let files = ['airhorn.mp3', 'monsterkill.mp3', 'troll.mp3', 'applause.mp3', 'nigger.mp3', 'scream.mp3', 'thefuckyoudo.mp3', 'megafaggot.mp3']
          let final = files[Math.floor(Math.random() * files.length)]
          if (data.suffix) {
            if (files.indexOf(data.suffix.toLowerCase() + '.mp3') > -1) {
              final = data.suffix.toLowerCase() + '.mp3'
            }
          }
          msg.channel.send(final)
          const dispatcher = connection.playFile(srcDirectory + '/sounds/' + final)
          msg.channel.send('Sound Played!')
          dispatcher.on('end', () => {
            connection.disconnect()
          })
        }
      })
    } else {
      reject('Not In A Voice Channel')
    }
  })
}
