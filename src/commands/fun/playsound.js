exports.data = {
  'name': 'PlaySound',
  'aliases': ['ps'],
  'desc': 'Play a sound inside your voice channel!',
  'usage': 'playsound [sound]',
  'note': 'You need to be inside a Voice Channel to use this command!\n**Sound list:** `Airhorn`, `MonsterKill`, `Troll`, `Applause`, `Nigger`, `Scream`, `TheFuckYouDo`, `MegaFaggot`',
  'new': true
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    if (msg.member.voiceChannel) {
      if (!msg.guild.voiceConnection) {
        //Not in a voiceChannel inside this guild.
        msg.member.voiceChannel.join().then((connection) => {
          //Setup sound to play
          let files = ['airhorn.mp3', 'monsterkill.mp3', 'troll.mp3', 'applause.mp3', 'nigger.mp3', 'scream.mp3', 'thefuckyoudo.mp3', 'megafaggot.mp3']
          let final = files[Math.floor(Math.random() * files.length)]
          if (data.suffix) {
            if (files.indexOf(data.suffix.toLowerCase() + '.mp3') > -1) {
              final = data.suffix.toLowerCase() + '.mp3'
            }
          }
          //Play Sound
          const dispatcher = connection.playFile(srcDirectory + '/sounds/' + final)
          msg.channel.send('Playing Sound!').then((Msg) => {
            dispatcher.on('end', () => {
              //When sound has been played, disconnect from voiceChannel and remove the 'Sound Played' message.
              connection.disconnect()
              Msg.delete()
            })
          })
        })
      } else {
        //In a voiceChannel inside this guild.
        if (msg.guild.voiceConnection.channel.id == msg.member.voiceChannel.id) {
          //Inside same voiceChannel as user.
          resolve('Bot Already Playing A Sound')
        } else {
          //Not in the same voiceChannel as user.
          resolve('Bot Already In VoiceChannel')
        }
      }
    } else {
      //User is not in a voiceChannel.
      resolve('User Not In VoiceChannel')
    }
  })
}
