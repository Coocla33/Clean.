exports.data = {
  'name': 'Trivia',
  'desc': 'Answer some questions and get a reward!',
  'usage': 'trivia',
  'userObjectRequired': true,
  'dm': true,
  'new': true
}

const superagent = require('superagent')
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities()

let token = undefined
let cache = []

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {

    //Send message for user
    msg.channel.send('Getting your Trivia question...').then((Msg) => {

      //Check token
      checkToken(function(succes) {
        if (succes) {
          //Get question
          getQuestion(function(question) {

            //Setup basic variables
            let messageArray = []
            let reward = 0

            //Setup Answers
            let answers = question.incorrect_answers
            let finalAnswers = []
            let lowercaseAnswers = []
            answers.splice(Math.floor(Math.random() * answers.length + 1), 0, question.correct_answer)

            answers.forEach((answer) => {
              finalAnswers.push(entities.decode(answer).trim())
              lowercaseAnswers.push(entities.decode(answer.toLowerCase()).trim())
            })

            //Setup reward
            if (question.difficulty == 'easy') {
              reward = 25 + Math.floor(Math.random() * 25)
            } else if (question.difficulty == 'medium') {
              reward = 50 + Math.floor(Math.random() * 50)
            } else {
              reward = 75 + Math.floor(Math.random() * 75)
            }

            //Setup message
            messageArray.push('**__Question__**')
            messageArray.push('*' + entities.decode(question.question).trim() + '*\n')
            messageArray.push('**__Answers__**')
            messageArray.push('► **' + finalAnswers.join('**\n► **') + '**\n')
            messageArray.push('**You have 1 minute to respond.**')


            //Create Embed
            let embed = {
              'description': messageArray.join('\n'),
              'color': handlers.misc.embedColor(msg),
              'timestamp': new Date(),
              'footer': {
                'text': '© Clean.'
              }
            }

            //Setup filter
            let filter = m => lowercaseAnswers.indexOf(m.content.toLowerCase()) > -1 && m.author.id == msg.author.id

            //Await message
            msg.channel.awaitMessages(filter, {max: 1, time: 60000}).then((m) => {

              //Check if the message is the correct answer
              if (m.first().content.toLowerCase() == question.correct_answer.toLowerCase()) {

                //Send reward message
                msg.channel.send('You guessed the right answer! You earned a stunning **$' + reward + '**!').then(() => {

                  //check stats.games
                  if (!data.user.stats.games.trivia) {
                    data.user.stats.games.trivia = {'won': 0, 'lost': 0, 'earned': 0}
                  }

                  //Save rewards
                  data.user.stats.games.trivia.won++
                  data.user.stats.games.trivia.earned += reward
                  data.user.stats.balance += reward
                  handlers.data.user.update(msg.author, data.user)
                })
              } else {

                //Wrong answer
                msg.channel.send('Ahw snap! That answer was wrong! The good answer was **' + question.correct_answer + '**!')

                //check stats.games
                if (!data.user.stats.games.trivia) {
                  data.user.stats.games.trivia = {'won': 0, 'lost': 0, 'earned': 0}
                }

                //Save rewards
                data.user.stats.games.trivia.lost++
                handlers.data.user.update(msg.author, data.user)
              }
            }).catch((err) => {
              msg.channel.send(':frowning: <@' + msg.author.id + '> You failed to answer the question in time...')

              //check stats.games
              if (!data.user.stats.games.trivia) {
                data.user.stats.games.trivia = {'won': 0, 'lost': 0, 'earned': 0}
              }

              //Save rewards
              data.user.stats.games.trivia.lost++
              handlers.data.user.update(msg.author, data.user)
            })

            //Send main message
            Msg.edit(':question: **' + question.category + ' - ' + question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1) +  '**', {embed})
          })
        } else {

          //ERRORORORORRRSSSS
          Msg.edit('Failed to get your Trivia Question! Please try again later today!')
        }
      })
    })
  })
}

//Check token
function checkToken(callback) {

  //Check if there still is a token
  if (!token) {

    //Request a new token
    superagent.get('https://opentdb.com/api_token.php?command=request').end(function(err, res) {

      //Error
      if (err) {
        console.log(err)
      } else {
        try {

          //Parse res
          let object = JSON.parse(res.text)

          //Check if there is a new token and set it
          if (object.response_code == 0) {
            token = object.token
            callback(true)
          }
        } catch(err) {
          console.log(err)
          callback(false)
        }
      }
    })
  } else {
    callback(true)
  }
}

//Get question
function getQuestion(callback) {

  //Check if there are still questions left
  if (cache.length > 0) {
    let question = cache[0]
    cache.shift()
    callback(question)

  //No questions left
  } else {

    //Get 50 fresh questions
    superagent.get('https://opentdb.com/api.php?amount=50&type=multiple&token=' + token).end(function(err, res) {

      //Parse res
      let object = JSON.parse(res.text)

      //If response code is 0
      if (object.response_code == 0) {

        //Setup new questions
        cache = object.results
        let question = cache[0]
        cache.shift()
        callback(question)

      //Invalid token
      } else if (object.response_code == 3 || object.response_code == 4) {

        //Remove token
        token = undefined

        //Get new token
        checkToken(function() {

          //Get 50 fresh questions
          superagent.get('https://opentdb.com/api.php?amount=50&type=multiple&token=' + token).end(function(err, res) {

            //Parse res
            let object = JSON.parse(res.text)

            //If response code is 0
            if (object.response_code == 0) {

              //Setup new questions
              cache = object.results
              let question = cache[0]
              cache.shift()
              callback(question)
            }
          })
        })
      }
    })
  }
}
