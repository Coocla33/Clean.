exports.data = {
  'name': 'EasterEgg',
  'desc': 'Hue.',
  'usage': 'Damn fine easteregg',
  'dm': false
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    msg.channel.send('You found the one and only Easter Egg! :egg:').catch((err) => {reject(err)})
  })
}
