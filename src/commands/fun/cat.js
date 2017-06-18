exports.data = {
  'name': 'Cat',
  'aliases': ['meow'],
  'desc': 'Psst kid! Want to see some pussy?',
  'usage': 'cat',
  'dm': true,
  'new': true
}

const superagent = require('superagent')
const xml2js = require('xml2js').parseString

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    msg.channel.send('Getting your cat!').then((Msg) => {
      superagent.get('http://thecatapi.com/api/images/get?format=xml').end(function(err, res) {
        if (err) {
          Msg.edit(':cat: Ahw... I did not find a cat in time! Mayby try another time :(')
        } else if (res.statusCode == 200) {
          xml2js(res.text, function(err, result) {
            Msg.edit(result.response.data[0].images[0].image[0].url[0])
          })
        } else {
          Msg.edit(':cat: Ahw... The cat escaped! Mayby try another time :(')
        }
      })
    })
  })
}
