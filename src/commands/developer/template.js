exports.data = {
  'name': 'template',
  'aliases': ['sample'],
  'desc': 'sample text',
  'usage': 'sample text',
  'userObjectRequired': false,
  'dm': true,
  'new': false,
  'indev': true,
  'note': 'This is a template',
  'permissions': ['SEND_MESSAGES']
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    msg.channel.send('placeholder').catch((err) => {reject(err)})
  })
}
