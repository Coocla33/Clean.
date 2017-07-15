const nedb = require('nedb')
const path = require('path')

let guildDB = new nedb({filename: path.join(__dirname, '..', 'data', 'guilds'), autoload: true, corruptAlertThreshold: 1})
let userDB = new nedb({filename: path.join(__dirname, '..', 'data', 'users'), autoload: true, corruptAlertThreshold: 1})

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

exports.user = {
  new: function(user) {
    return new Promise((resolve, reject) => {
      userDB.findOne({id: user.id}, function(err, doc) {
        if (!err) {
          if (!doc) {
            let data = {}
            data.id = user.id
            data.stats = {}
            data.stats.balance = 0
            data.stats.games = {}
            data.settings = {}
            userDB.insert(data, function(err) {
              if (err) {
                reject(err)
              } else {
                resolve(data)
              }
            })
          } else {
            reject('User Already Exists')
          }
        } else {
          reject(err)
        }
      })
    })
  },
  get: function(user) {
    return new Promise((resolve, reject) => {
      userDB.findOne({id: user.id}, function(err, doc) {
        if (doc) {
          resolve(doc)
        } else {
          reject('User Does Not Exist')
        }
      })
    })
  },
  update: function(user, object) {
    return new Promise((resolve, reject) => {
      userDB.findOne({id: user.id}, function(err, doc) {
        if (!err) {
          if (doc) {
            for (let i in object) {
              doc[i] = object[i]
            }
            userDB.update({id: user.id}, doc, {}, function(err) {
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
