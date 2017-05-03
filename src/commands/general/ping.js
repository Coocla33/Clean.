exports.data = {
  'name': 'Ping',
  'aliases': ['pong', 'latency'],
  'desc': 'Test he latency of the bot.',
  'usage': 'ping',
  'dm': true
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    let date = new Date()
    msg.channel.send('...').then((Msg) => {
      let responseObject = ['Pong! ', 'Pang! ', 'Bang! ', 'Rate Limited! ']
      Msg.edit(responseObject.sample() + '(' + (new Date() - date) + 'ms)').catch((err) => {reject(err)})
    }).catch((err) => {reject(err)})
  })
}
