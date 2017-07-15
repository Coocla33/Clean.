exports.data = {
  'name': 'Cat',
  'aliases': ['meow'],
  'desc': 'Psst kid! Want to see some pussy?',
  'usage': 'cat',
  'dm': true
}

const superagent = require('superagent')
const xml2js = require('xml2js').parseString

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    msg.channel.send('Getting your cat!').then((Msg) => {

      //GET request to thecatapi
      superagent.get('http://thecatapi.com/api/images/get?format=xml').end(function(err, res) {

        //Check if error
        if (err) {
          Msg.edit(':cat: Ahw... I did not find a cat in time! Mayby try another time :(')

        //Check if statusCode is 200
        } else if (res.statusCode == 200) {

          //Use xml2js to change the xml to json arrays for some reason...
          xml2js(res.text, function(err, result) {

            //Create embed
            let embed = {
              'color': handlers.misc.embedColor(msg),
              'timestamp': new Date(),
              'image': {
                'url': result.response.data[0].images[0].image[0].url[0]
              },
              'footer': {
                'text': '© Clean.'
              }
            }

            //Edit the message with the url of the cat image
            Msg.edit('', {embed})
          })

        //When there is no cat picture ;-;
        } else {
          Msg.edit(':cat: Ahw... The cat escaped! Mayby try another time :(')
        }
      })
    })
  })
}
