exports.data = {
  'name': 'reloadCommand',
  'aliases': ['rc'],
  'desc': 'Reload any command you want!',
  'usage': 'reloadcommand (command)',
  'dm': true,
  'unlisted': true
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    if (data.suffix) {
      handlers.command.reload(data.suffix).then((response) => {
        msg.channel.send(response).catch((err) => {reject(err)})
      }).catch((err) => {
        if (err.stack) {
          msg.channel.send('```js\n' + err.stack + '```').catch((err) => {reject(err)})
        } else {
          msg.channel.send('```js\n' + err + '```').catch((err) => {reject(err)})
        }
      })
    } else {
      resolve('Missing Suffix')
    }
  })
}
