exports.join = function(member) {
  handlers.data.guild.get(member.guild).then((guild) => {
    if (guild.settings.greeting) {
      if (guild.settings.greeting.join) {
        if (guild.settings.greeting.join.enable) {
          bot.channels.get(guild.settings.greeting.join.channel).sendMessage(setupMessage(member, guild.settings.greeting.join.message))
        }
      }
    }
  }).catch((err) => {
    throw err
  })
}

exports.leave = function(member) {
  handlers.data.guild.get(member.guild).then((guild) => {
    if (guild.settings.greeting) {
      if (guild.settings.greeting.leave) {
        if (guild.settings.greeting.leave.enable) {
          bot.channels.get(guild.settings.greeting.leave.channel).sendMessage(setupMessage(member, guild.settings.greeting.leave.message))
        }
      }
    }
  }).catch((err) => {
    throw err
  })
}

function setupMessage(member, message) {
  return message.replace('${user_name}', member.user.username).replace('${guild_name}', member.guild.name).replace('${user_join_count}', handlers.misc.ordinalSuffix(member.guild.memberCount))
}
