const moment = require('moment')
               require('moment-duration-format')

exports.embedColor = function(msg) {
  if (msg.channel.type == 'dm') {
    return 0xFFFFFF
  } else {
    return msg.guild.members.get(bot.user.id).highestRole.color
  }
}

exports.msToRead = function(ms) {
  return moment.duration(Number(ms), 'ms').format('Y[y], M[MM], d[d], h[h], m[m and] s[s]')
}
