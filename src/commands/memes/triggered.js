exports.data = {
  'name': 'Triggered',
  'desc': 'I am so TRIGGERED!',
  'usage': 'triggered',
  'dm': true,
  'new': false,
  'indev': true
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {

    //Setup Variables
    let imageArray = ['http://i.imgur.com/PijcGEU.gif', 'https://media.tenor.com/images/066eecd682ed6c4b7c6376b06055b16d/tenor.gif', 'https://media.giphy.com/media/vk7VesvyZEwuI/giphy.gif']

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
