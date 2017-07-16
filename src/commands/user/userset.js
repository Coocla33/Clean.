exports.data = {
  'name': 'UserSet',
  'aliases': ['uset', 'us'],
  'desc': 'Setting your user settings!',
  'usage': 'us (settingType) (value)',
  'userObjectRequired': true,
  'dm': true,
  'new': true,
  'note':
    '**Settings Types**\n'+
    '**desc**: *A small description of the user.* \nExample: `I am the greatest!` (Max 512 characters)\n\n' +
    '**twitter**: *Twitter username.* \nExample: `@Coocla33` (Max 128 characters)\n\n' +
    '**steam**: *Steam username.* \nExample: `Hardcore Killer` (Max 128 characters)\n\n' +
    '**youtube**: *YouTube username.* \nExample: `PewDiePie` (Max 128 characters)\n\n' +
    '**twitch**: *Twitch username.* \nExample: `Cuckinator9000` (Max 128 characters)\n\n' +
    '**bday**: *Date.* \nExample: `20-12` (Max 64 characters)\n\n' +
    '**gender**: *Gender type.* \nExample: `Apache attack helicopter.` (Max 128 characters)'
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    if (data.suffix) {

      //Setup variables
      let options = data.suffix.split(' ')
      let setting = options[0].toLowerCase()
      let value = data.suffix.substr(data.suffix.split(' ')[0].length + 1)
      let socialMediaSettings = ['twitter', 'steam', 'youtube', 'twitch']
      let miscSettings = ['bday', 'gender']

      if (value) {

        if (!data.user.profile) {
          data.user.profile = {}
        }


        //description
        if (setting == 'desc') {
          if (value.split('').length < 512) {
            data.user.profile.desc = value.trim()
            handlers.data.user.update(msg.author, data.user).then(() => {
              msg.channel.send('**Updated! :tada:**\n`desc: ' + value.trim() + '`')
            })
          } else {
            toLong(512, msg)
          }
        }

        //Misch
        else if (miscSettings.indexOf(setting) > -1) {

          if (!data.user.profile.misc) {
            data.user.profile.misc = true
          }

          //gender
          if (setting == 'gender') {
            if (value.split('').length < 128) {
              data.user.profile.gender = value
              handlers.data.user.update(msg.author, data.user).then(() => {
                msg.channel.send('**Updated! :tada:**\n`gender: ' + value + '`')
              })
            } else {
              toLong(128, msg)
            }
          }

          //bday
          if (setting == 'bday') {
            if (value.split('').length < 64) {
              data.user.profile.bday = value
              handlers.data.user.update(msg.author, data.user).then(() => {
                msg.channel.send('**Updated! :tada:**\n`bday: ' + value + '`')
              })
            } else {
              toLong(64, msg)
            }
          }
        }

        //Social Media
        else if (socialMediaSettings.indexOf(setting) > -1) {

          if (!data.user.profile.socialMedia) {
            data.user.profile.socialMedia = true
          }

          //Twitter
          if (setting == 'twitter') {
            if (value.split('').length < 128) {
              if (value.startsWith('@')) {
                data.user.profile.twitter = value
              } else {
                data.user.profile.twitter = '@' + value
              }
              handlers.data.user.update(msg.author, data.user).then(() => {
                msg.channel.send('**Updated! :tada:**\n`twitter: ' + value + '`')
              })
            } else {
              toLong(128, msg)
            }
          }

          //Steam
          else if (setting == 'steam') {
            if (value.split('').length < 128) {
              data.user.profile.steam = value
              handlers.data.user.update(msg.author, data.user).then(() => {
                msg.channel.send('**Updated! :tada:**\n`steam: ' + value + '`')
              })
            } else {
              toLong(128, msg)
            }
          }

          //YouTube
          else if (setting == 'youtube') {
            if (value.split('').length < 128) {
              data.user.profile.youtube = value
              handlers.data.user.update(msg.author, data.user).then(() => {
                msg.channel.send('**Updated! :tada:**\n`youtube: ' + value + '`')
              })
            } else {
              toLong(128, msg)
            }
          }

          //Twitch
          else if (setting == 'twitch') {
            if (value.split('').length < 128) {
              data.user.profile.twitch = value
              handlers.data.user.update(msg.author, data.user).then(() => {
                msg.channel.send('**Updated! :tada:**\n`twitch: ' + value + '`')
              })
            } else {
              toLong(128, msg)
            }
          }
        } else {
          resolve('Invalid settingType')
        }

      } else {
        resolve('Missing Value')
      }

    } else {
      resolve('Missing settingType')
    }
  })
}

function toLong(max, msg) {
  msg.channel.send('That value is to long! You can only have **' + max + '** characters for this setting!')
}