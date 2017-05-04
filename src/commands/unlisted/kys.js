exports.data = {
  'name': 'kys',
  'aliases': ['suicide'],
  'desc': 'Kill Yourself',
  'usage': 'kys',
  'dm': true
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    msg.channel.send('Wy so rude ;-;').catch((err) => {reject(err)})
  })
}
