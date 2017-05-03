exports.message = {
  update: function(type, msg, state) {
    return new Promise((resolve, reject) => {
      type = type.toLowerCase()
      if (type == 'message') {
        handlers.data.guild.get(msg.guild).then((guild) => {
          let currentDate = (new Date().getMonth() + 1) + '/' + new Date().getDate() + '/' + new Date().getFullYear()
          let messageObject = getCurrentMessageObject(guild, currentDate)
          if (messageObject) {
            updateMessageObject(messageObject, msg, state, guild).then((response) => {
              resolve(response)
            }).catch((err) => {
              reject(err)
            })
          } else {
            updateMessageObject({"object": {"date": currentDate, "messages": 0, "mentions": 0, "removed": 0, "edited": 0}, count: guild.stats.messageObjects.length - 1}, msg, state, guild).then((response) => {
              resolve(response)
            }).catch((err) => {
              reject(err)
            })
          }
        }).catch((err) => {
          reject(err)
        })
      } else if (type == 'activity') {
        //place holder
      } else {
        reject('Invalid Type')
      }
    })
  }
}

function getCurrentMessageObject(guild, currentDate) {
  for (let i in guild.stats.messageObjects) {
    if (guild.stats.messageObjects[i].date == currentDate) {
      return {'object': messageObject, 'count': i}
    }
  }
}

function updateMessageObject(messageObject, msg, state, guild) {
  return new Promise((resolve, reject) => {
    if (state == 'edited') {
      messageObject.object.edited++
    } else if (state == 'removed') {
      messageObject.object.removed++
    } else if (msg.mentions.users.size > 0) {
      messageObjetc.object.mentions += msg.mentions.users.size
    }
    messageObject.object.messages++
    guild.stats.messageObjects[messageObject.count] = messageObject.object
    handlers.data.guild.update(msg.guild, guild).then((response) => {
      resolve('Updated')
    }).catch((err) => {
      reject(err)
    })
  })
}
