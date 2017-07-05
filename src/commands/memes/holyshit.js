exports.data = {
  'name': 'HolyShit',
  'desc': 'Holy shit that is amazing!',
  'usage': 'holyshit',
  'aliases': ['hs'],
  'dm': true,
  'new': true
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {

    //Setup Variables
    let imageArray = ['https://i.imgflip.com/8zd54.jpg', 'https://i.imgflip.com/10n7tw.jpg']

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
