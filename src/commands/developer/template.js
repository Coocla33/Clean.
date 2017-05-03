exports.data = {
  'name': 'template',
  'aliases': ['sample'],
  'desc': 'sample text',
  'usage': 'sample text',
  'dm': true,
  'permissions': []
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    msg.channel.send('placeholder').catch((err) => {reject(err)})
  })
}
