const nedb = require('nedb')
const path = require('path')

let guildDB = new nedb({filename: path.join(__dirname, '..', 'data', 'guilds'), autoload: true, corruptAlertThreshold: 1})

exports.guild = {
  new: function(guild) {
    return new Promise((resolve, reject) => {
      guildDB.findOne({id: guild.id}, function(err, doc) {
        if (!err) {
          if (!doc) {
            let data = {}
            data.id = guild.id
            data.settings = {}
            data.settings.prefix = config.prefix
            data.stats = {}
            data.stats.messageObjects = []
            data.stats.activityObjects = []
            guildDB.insert(data, function(err) {
              if (err) {
                reject(err)
              } else {
                resolve(data)
              }
            })
          } else {
            reject('Guild Already Exists')
          }
        } else {
          reject(err)
        }
      })
    })
  },
  get: function(guild) {
    return new Promise((resolve, reject) => {
      guildDB.findOne({id: guild.id}, function(err, doc) {
        if (doc) {
          resolve(doc)
        } else {
          reject('Guild Does Not Exist')
        }
      })
    })
  },
  update: function(guild, object) {
    return new Promise((resolve, reject) => {
      guildDB.findOne({id: guild.id}, function(err, doc) {
        if (!err) {
          if (doc) {
            for (let i in object) {
              doc[i] = object[i]
            }
            guildDB.update({id: guild.id}, doc, {}, function(err) {
              if (!err) {
                resolve(doc)
              } else {
                reject(err)
              }
            })
          } else {
            reject('Guild Does Not Exist')
          }
        } else {
          reject(err)
        }
      })
    })
  }
}
