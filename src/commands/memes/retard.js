exports.data = {
  'name': 'Retard',
  'desc': 'ReTarDifY Ev3rYthInG!',
  'usage': 'retard (text)',
  'dm': true
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {

    //Check suffix
    if (!data.suffix) {
      data.suffix = 'no suffix provided.'
    }

    //Setup variables
    let message = data.suffix.toLowerCase().split('')
    let final = []

    //for each letter of the message
    message.forEach((letter) => {

      //If letter not a space
      if (letter != ' ') {

        //Check if letter is an e
        if (letter == 'e') {

          //Change of 1 to 3
          if (Math.floor(Math.random() * 3) == 0) {

            //Push a 3 instead of an e
            final.push('3')

          //Change 1 to 3 of uppercase
          } else if (Math.floor(Math.random() * 3) == 0) {

            //Push uppercase
            final.push(letter.toUpperCase())

          //else push normal letter
          } else {
            final.push(letter)
          }

        //If letter is not an e
        } else {

          //Change of 1 to 3 for uppercase
          if (Math.floor(Math.random() * 3) == 0) {

            //Push uppercase letter
            final.push(letter.toUpperCase())

          //else push normal letter
          } else {
            final.push(letter)
          }
        }
      } else {

        //Push the space
        final.push(' ')
      }
    })

    //Create embed
    let embed = {
      'color': handlers.misc.embedColor(msg),
      'timestamp': new Date(),
      'image': {
        'url': 'https://thumbs.mic.com/MjgwYjY0YTZhYiMvY1RLZ3JZNlJDbzJaZ25YTnNuMDdQUUM5Z01ZPS8weDYzOjQ5MHgzMDAvMTYwMHg5MDAvZmlsdGVyczpmb3JtYXQoanBlZyk6cXVhbGl0eSg4MCkvaHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL3BvbGljeW1pYy1pbWFnZXMvbnc0eGU4NHRkcXlpMTVrZXViMHV3eHp0ZmZhb2NjbnN6dmRveGh1MmNxcTh5bGppY3Npcng4ZHczdTRlbXoxeS5qcGc.jpg'
      },
      'footer': {
        'text': '© Clean.'
      }
    }

    //Send Embed
    msg.channel.send('**' + final.join('') + '**', {embed})
  })
}