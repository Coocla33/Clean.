const moment = require('moment')
               require('moment-duration-format')

exports.embedColor = function(msg) {
  if (msg.channel.type == 'dm') {
    let colors = [0xff51e1, 0xd051ff, 0x7051ff, 0x5194ff, 0x51ffca, 0x51ff5f, 0xdfff51, 0xffaa51, 0xff5151]
    return colors.sample()
  } else {
    return msg.guild.members.get(bot.user.id).highestRole.color
  }
}

exports.msToRead = function(ms) {
  return moment.duration(Number(ms), 'ms').format('Y[y], M[MM], d[d], h[h], m[m], s[s and] S[ms]')
}
