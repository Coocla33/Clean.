exports.data = {
  'name': 'PlaySound',
  'aliases': ['ps'],
  'desc': 'Play a sound inside your voice channel!',
  'usage': 'playsound [sound]',
  'note': 'You need to be inside a Voice Channel to use this command!\n**Sound list:** `Airhorn`, `MonsterKill`, `Troll`, `Applause`, `Nigger`, `Scream`, `TheFuckYouDo`, `MegaFaggot`'
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {

    //Check if member is in voice channel
    if (msg.member.voiceChannel) {

      //Check if bot is already in a voicechannel inside this guild
      if (!msg.guild.voiceConnection) {

        //Join voicechannel
        msg.member.voiceChannel.join().then((connection) => {

          //Setup sound
          //Setup variables
          let files = ['airhorn.mp3', 'monsterkill.mp3', 'troll.mp3', 'applause.mp3', 'nigger.mp3', 'scream.mp3', 'thefuckyoudo.mp3', 'megafaggot.mp3']
          let final = files[Math.floor(Math.random() * files.length)]

          //Check if suffix
          if (data.suffix) {

            //Check if suffix is a soundfile
            if (files.indexOf(data.suffix.toLowerCase() + '.mp3') > -1) {

              //Set final soundfile as suffix
              final = data.suffix.toLowerCase() + '.mp3'
            }
          }

          //Setup dispatcher and play the final sound
          const dispatcher = connection.playFile(srcDirectory + '/sounds/' + final)

          //Send message stating that the sound is being played
          msg.channel.send('Playing Sound!').then((Msg) => {

            //On end of sound
            dispatcher.on('end', () => {

              //Disconnect from voice channel
              connection.disconnect()

              //Remove message
              Msg.delete()
            })
          }).catch((err) => {reject(err)})
        }).catch((err) => {reject(err)})
      } else {

        //Check if user is already inside the same voice channel
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
