exports.data = {
  'name': '8Ball',
  'desc': 'I shall predict the future!',
  'usage': '8ball',
  'dm': true,
  'new': true
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    let array = ['It is certain', 'It is decidedly so', 'Without a doubt', 'Yes – definitely', 'You may rely on it', 'As I see it, yes', 'Most likely', 'Outlook good', 'Yes', 'Signs point to yes', 'Reply hazy, try again', 'Ask again later', 'Better not tell you now', 'Cannot predict now', 'Concentrate and ask again', "Don't count on it", 'My reply is no', 'My sources say no', 'Outlook not so good', 'Very doubtful']
    msg.channel.send(array[Math.floor(Math.random() * array.length)])
  })
}
