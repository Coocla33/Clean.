exports.data = {
  'name': 'EasterEgg',
  'aliases': [],
  'desc': 'Hue.',
  'usage': 'Damn fine easteregg',
  'dm': true,
  'permissions': []
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    msg.channel.send('You found the one and only Easter Egg! :egg:').catch((err) => {reject(err)})
  })
}
