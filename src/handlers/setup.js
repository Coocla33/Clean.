const fs = require('fs')
const path = require('path')

exports.setup = function() {
  return new Promise((resolve, reject) => {
    let handlers = {}
    let handlersFile = fs.readdirSync(__dirname)
    for (let handler of handlersFile) {
      if (handler.endsWith('.js')) {
        try {
          handlers[handler.slice(0, -3)] = require('./' + handler)
        } catch(err) {
          reject(err)
        }
      }
    }
    resolve(handlers)
  })
}

exports.reload = function(handler) {
  return new Promise((resolve, reject) => {
    handler = handler.toLowerCase()
    if (handler == 'all') {
      let handlers = {}
      let handlersFile = fs.readdirSync(__dirname)
      for (let handler of handlersFile) {
        if (handler.endsWith('.js')) {
          try {
            delete require.cache[path.join(__dirname, handler + '.js')]
            global.handlers[handler.slice(0, -3)] = require('./' + handler)
          } catch(err) {
            reject(err)
          }
        }
      }
    } else {
      let handlersFile = fs.readdirSync(__dirname)
      if (handlersFile.indexOf(handler + '.js') > -1) {
        try {
          delete require.cache[__dirname + '/' + handler + '.js']
          global.handlers[handler] = require('./' + handler + '.js')
          resolve('Reloaded')
        } catch(err) {
          reject(err)
        }
      } else {
        reject('Handler Does Not Exist')
      }
    }
  })
}
