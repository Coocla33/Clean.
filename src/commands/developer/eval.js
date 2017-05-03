exports.data = {
  'name': 'Eval',
  'aliases': ['doshit', 'code'],
  'desc': 'Evaluate code.',
  'usage': 'eval (code)',
  'dm': true,
  'permissions': ['ADMINISTRATOR']
}

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    if (data.suffix) {
      msg.channel.send('...').then((Msg) => {
        try {
          var result = eval(data.suffix)
          if (typeof result !== 'object') {
            let embed = {
              title: 'Oh god you did it. \u{d83c}\u{df89}',
              color: 0x00FF00,
              timestamp: new Date(),
              fields: [
                {
                  name: 'Input',
                  value: '```js\n' + data.suffix + '```'
                }, {
                  name: 'Output',
                  value: '```js\n' + result + '```'
                }
              ],
              footer: {
                text: '© Samantha'
              }
            }
            Msg.edit('', {embed}).catch((err) => {reject(err)})
          } else {
            let embed = {
              title: 'Oh god you did it. \u{d83c}\u{df89}',
              color: 0x00FFFF,
              timestamp: new Date(),
              fields: [
                {
                  name: 'Input',
                  value: '```js\n' + data.suffix + '```'
                }, {
                  name: 'Output',
                  value: '```json\n' + JSON.stringify(result) + '```'
                }
              ],
              footer: {
                text: '© Samantha'
              }
            }
            Msg.edit('', {embed}).catch((err) => {reject(err)})
          }
        } catch (err) {
          let embed = {
            title: 'Fucking. Dipshit. \u{d83d}\u{dca9}',
            color: 0xFF0000,
            timestamp: new Date(),
            fields: [
              {
                name: 'Input',
                value: '```js\n' + data.suffix + '```'
              }, {
                name: 'Output',
                value:  '```js\n' + err + '```'
              }
            ],
            footer: {
              text: '© Samantha'
            },
          }
          Msg.edit('', {embed}).catch((err) => {reject(err)})
        }
      }).catch((err) => {reject(err)})
    } else {
      resolve('No suffix. Dipshit.')
    }
  })
}
