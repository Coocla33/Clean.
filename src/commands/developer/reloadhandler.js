exports.data = {
  'name': 'reloadHandler',
  'aliases': ['rh'],
  'desc': 'Reload any handler you want!',
  'usage': 'reloadhandler (handler, all)',
  'dm': true,
  'unlisted': true,
  'permissions': []
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    if (data.suffix) {
      handlers.setup.reload(data.suffix).then((response) => {
        if (response == 'Reloaded') {
          msg.channel.send(response).catch((err) => {reject(err)})
        } else {
          global.handlers = handlers
          msg.channel.send('Updated ALL Handlers!').catch((err) => {reject(err)})
        }
      }).catch((err) => {
        msg.channel.send('```js\n' + err.stack + '```').catch((err) => {reject(err)})
      })
    } else {
      resolve('Missing Suffix')
    }
  })
}
