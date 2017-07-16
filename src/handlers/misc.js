const moment = require('moment')
               require('moment-duration-format')

exports.embedColor = function(msg) {
  if (msg.channel.type == 'dm') {
    return 0xFFFFFF
  } else {
    return msg.guild.members.get(bot.user.id).highestRole.color
  }
}

exports.timeToRead = function(value, unit) {
  return moment.duration(Number(value), unit).format('Y[y], M[MM], d[d], h[h], m[m and] s[s]')
}

exports.ordinalSuffix = function(i) {
  let j = i % 10
  let k = i % 100
  if (j == 1 && k != 11) {
    return i + "st"
  }
  if (j == 2 && k != 12) {
    return i + "nd"
  }
  if (j == 3 && k != 13) {
    return i + "rd"
  }
  return i + "th"
}
