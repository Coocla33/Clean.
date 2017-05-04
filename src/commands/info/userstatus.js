exports.data = {
  'name': 'UserStatus',
  'aliases': ['us'],
  'desc': 'Show the status of your users, in a fancy pie chart!',
  'usage': 'userstatus'
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
            'borderWidth': [5, 5, 5]
          }
        ]
      }
      for (let member of msg.guild.members.array()) {
        if (member.presence.status != 'offline') {
          if (graphObject[member.presence.status]) {
            graphObject[member.presence.status].count++
          } else {
            graphObject[member.presence.status] = {'count': 1, 'color': ''}
            if (member.presence.status == 'online') {graphObject[member.presence.status].color = 'rgb(52, 219, 73)'}
            else if (member.presence.status == 'dnd') {graphObject[member.presence.status].color = 'rgb(219, 52, 52)'}
            else {graphObject[member.presence.status].color = 'rgb(216, 219, 52)'}
          }
        }
      }

      for (let status in graphObject) {
        graphData.labels.push(status)
        graphData.datasets[0].data.push(graphObject[status].count)
        graphData.datasets[0].backgroundColor.push(graphObject[status].color)
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
        return chart.writeImageToFile('image/png', './src/cache/userstatus.png')
      }).then(() => {
        Msg.delete()
        msg.channel.send({file: './src/cache/userstatus.png'}).catch((err) => {reject(err)})
      }).catch((err) => {
        reject(err)
      })
    }).catch((err) => {reject(err)})
  })
}
