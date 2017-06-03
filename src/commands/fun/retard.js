exports.data = {
  'name': 'Retard',
  'desc': 'ReTarDifY Ev3rYthInG!',
  'usage': 'retard (text)',
  'dm': true,
  'indev': true
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    if (data.suffix) {
      let message = data.suffix.toLowerCase().split('')
      let final = []
      message.forEach((letter) => {
        if (letter != ' ') {
          if (letter == 'e') {
            if (Math.floor(Math.random() * 3) == 0) {
              final.push('3')
            } else if (Math.floor(Math.random() * 3) == 0) {
              final.push(letter.toUpperCase())
            } else {
              final.push(letter)
            }
          } else {
            if (Math.floor(Math.random() * 3) == 0) {
              final.push(letter.toUpperCase())
            } else {
              final.push(letter)
            }
          }
        } else {
          final.push(' ')
        }
      })
      msg.channel.send('**' + final.join('') + '**', {file: './src/images/spongebob-retard.jpg'})
    } else {
      msg.channel.send('**nO sUfFix pRovIdEd,**', {file: './src/images/spongebob-retard.jpg'})
    }
  })
}
