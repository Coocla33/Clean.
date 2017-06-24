exports.data = {
  'name': 'Perhaps',
  'desc': 'Perhaps...',
  'usage': 'perhaps',
  'dm': true,
  'new': true
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {

    //Setup Variables
    let imageArray = ['http://s2.quickmeme.com/img/1f/1ff19fe44bc6f2f74c6ee7510d104fb3352fe648943791a1eb9ef7df6182993f.jpg', 'http://s.quickmeme.com/img/92/9206c7b3d9fb326efaaf82468a2a4f4eb0bb2527e93e9e87d78e7cbd20f39896.jpg', 'https://cdn.discordapp.com/attachments/175509297252401152/325358524324380672/Cow.png']

    //Create embed
    let embed = {
      'color': handlers.misc.embedColor(msg),
      'timestamp': new Date(),
      'image': {
        'url': imageArray[Math.floor(Math.random() * imageArray.length)]
      },
      'footer': {
        'text': '© Clean.'
      }
    }

    //Send Embed
    msg.channel.send('', {embed})
  })
}
