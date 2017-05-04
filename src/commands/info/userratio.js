exports.data = {
  'name': 'UserRatio',
  'aliases': ['ur'],
  'desc': 'Showing the ratio of users, bots and nitro users in a pie chart!',
  'usage': 'userratio'
}

const chartjs = require('chartjs-node')

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    msg.channel.send('Generating Image, this might take a while...').then((Msg) => {
      let graphObject = {}
      let graphData = {
        'labels': [],
        'datasets': [
          {
            'data': [],
            'backgroundColor': [],
            'borderWidth': [5, 5]
          }
        ]
      }
      for (let member of msg.guild.members.array()) {
        if (!member.user.bot) {
          if (graphObject['Normal Users']) {
            graphObject['Normal Users'].count++
          } else {
            graphObject['Normal Users'] = {'count': 1, 'color': 'rgb(52, 219, 73)'}
          }
        } else {
          if (graphObject['Bots']) {
            graphObject['Bots'].count++
          } else {
            graphObject['Bots'] = {'count': 1, 'color': 'rgb(219, 52, 52)'}
          }
        }
      }

      for (let user in graphObject) {
        graphData.labels.push(user)
        graphData.datasets[0].data.push(graphObject[user].count)
        graphData.datasets[0].backgroundColor.push(graphObject[user].color)
      }
      let chart = new chartjs(1024, 1024)
      chart.drawChart({
        'type': 'pie',
        'data': graphData,
        'options': {
          'cutoutPercentage': 5
        }
      }).then(() => {
        return chart.getImageBuffer('image/png')
      }).then((buffer) => {
        return chart.getImageStream('image/png')
      }).then((streamResult) => {
        return chart.writeImageToFile('image/png', './src/cache/userratio.png')
      }).then(() => {
        Msg.delete()
        msg.channel.send({file: './src/cache/userratio.png'}).catch((err) => {reject(err)})
      }).catch((err) => {
        reject(err)
      })
    }).catch((err) => {reject(err)})
  })
}
