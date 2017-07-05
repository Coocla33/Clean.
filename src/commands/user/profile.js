exports.data = {
  'name': 'Profile',
  'desc': 'Showing the user profile of a specific user!',
  'usage': 'profile [@mention]',
  'userObjectRequired': true,
  'dm': true,
  'new': true
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {

    //Setup user object
    checkMentionedUser(msg, data, function(msg, data) {

      //Setup variables
      let messageArray = []
      let user = msg.author

      if (msg.mentions.users.size > 0) {
        user = msg.mentions.users.array()[0]
      }

      //description
      if (data.user.profile && data.user.profile.desc) {
        messageArray.push('**__Description__**')
        messageArray.push('*' + data.user.profile.desc + '*\n')
      }

      //Statistics
      messageArray.push('**__Statistics__**')
      messageArray.push('► Balance: **$' + data.user.stats.balance + '**')

      //Trivia stats
      if (data.user.stats.games.trivia) {
        messageArray.push('► Trivia: Won **' + data.user.stats.games.trivia.won + '/' + (data.user.stats.games.trivia.lost + data.user.stats.games.trivia.won) + '!** Earned **$' + data.user.stats.games.trivia.earned + '**.')
      }

      messageArray.push('')

      //Check profile
      if (data.user.profile) {

        //social media
        if (data.user.profile.socialMedia) {
          messageArray.push('**__Social Media__**')

          if (data.user.profile.steam) {
            messageArray.push('► Steam: **' + data.user.profile.steam + '**')
          }

          if (data.user.profile.twitter) {
            messageArray.push('► Twitter: **' + data.user.profile.twitter + '**')
          }

          if (data.user.profile.youtube) {
            messageArray.push('► YouTube: **' + data.user.profile.youtube + '**')
          }

          if (data.user.profile.twitch) {
            messageArray.push('► Twitch: **' + data.user.profile.twitch + '**')
          }

          messageArray.push('')
        }

        //misc
        if (data.user.profile.misc) {
          messageArray.push('**__Miscellaneous__**')

          if (data.user.profile.gender) {
            messageArray.push('► Gender: **' + data.user.profile.gender + '**')
          }

          if (data.user.profile.bday) {
            messageArray.push('► Birthday: **' + data.user.profile.bday + '**')
          }

          messageArray.push('')
        }
      }

      //Create Embed
      let embed = {
        'description': messageArray.join('\n'),
        'color': handlers.misc.embedColor(msg),
        'timestamp': new Date(),
        'footer': {
          'text': '© Clean.'
        }
      }

      //Send embed
      if (config.master.indexOf(user.id) > -1) {
        msg.channel.send('User Profile of **' + user.username + '** :star2:', {embed})
      } else {
        msg.channel.send('User Profile of **' + user.username + '**', {embed})
      }
    })
  })
}

function checkMentionedUser(msg, data, callback) {
  if (msg.mentions.users.size > 0) {
    handlers.data.user.get(msg.mentions.users.array()[0]).then((user) => {
      data.user = user
      callback(msg, data)
    }).catch((err) => {
      callback(msg, data)
    })
  } else {
    callback(msg, data)
  }
}
