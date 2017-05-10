exports.data = {
  'name': 'UserGrowth',
  'aliases': ['ug'],
  'desc': 'Showing the growth of the guild with a nice graph!',
  'usage': 'usergrowth',
  'new': true
}

const chartjs = require('chartjs-node')

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    msg.channel.send('Generating Image, this might take a while...').then((Msg) => {
      let dataObject = {unsorted: {}, sorted: [], count: [], preCount: 0}
      let guild = msg.guild
      let graphData = {
        labels: [],
        datasets: [
          {
            label: 'User Growth',
            fill: true,
            lineTension: 0,
            backgroundColor: 'rgba(219, 52, 124, 0.4)',
            borderColor: 'rgb(219, 52, 124)',
            borderCapStyle: 'butt',
            borderJoinStyle: 'miter',
            pointBorderColor: "rgb(219, 52, 124)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgb(219, 52, 124)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: [],
            spanGaps: false
          }, {
            label: 'Total User Count',
            fill: true,
            lineTension: 0,
            backgroundColor: 'rgba(52, 152, 219, 0.4)',
            borderColor: 'rgb(52, 152, 219)',
            borderCapStyle: 'butt',
            borderJoinStyle: 'miter',
            pointBorderColor: "rgb(52, 152, 219)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgb(52, 152, 219)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: [],
            spanGaps: false
          }
        ]
      }
      //Setup Data
      msg.guild.members.forEach((member) => {
        let date = member.joinedAt
        if (dataObject.unsorted[date.getFullYear()]) {
          if (dataObject.unsorted[date.getFullYear()][date.getMonth() + 1]) {
            dataObject.unsorted[date.getFullYear()][date.getMonth() + 1]++
          } else {
            dataObject.unsorted[date.getFullYear()][date.getMonth() + 1] = 1
          }
        } else {
          dataObject.unsorted[date.getFullYear()] = {[date.getMonth() + 1]: 1}
        }
      })
      //Sort
      for (let year in dataObject.unsorted) {
        for (let month in dataObject.unsorted[year]) {
          dataObject.sorted.push({month: month, 'year': year, value: dataObject.unsorted[year][month]})
        }
      }
      //Insert Data, and setup count and insert to
      for (let object of dataObject.sorted) {
        graphData.labels.push(object.year + '/' + object.month)
        graphData.datasets[0].data.push(object.value)
        graphData.datasets[1].data.push(object.value + dataObject.preCount)
        dataObject.preCount = object.value + dataObject.preCount
      }

      let chart = new chartjs(1920, 1080)
      chart.drawChart({
        'type': 'line',
        'data': graphData,
        'options': {
          'scaleFontColor': 'white',
          'title': {
            'display': true,
            'fontSize': 32,
            'fontColor': 'white',
            'text': 'User Growth of ' + msg.guild.name
          },
          'scales': {
            'xAxes': [{
              'ticks': {
                'fontSize': 20,
                'fontColor': 'white'
              },
              'gridLines': {
                'display': true,
                'color': 'rgb(150, 150, 150)'
              }
            }],
            'yAxes': [{
              'ticks': {
                'fontSize': 24,
                'fontColor': 'white'
              },
              'gridLines': {
                'display': true,
                'color': 'rgb(150, 150, 150)'
              }
            }]
          }
        }
      }).then(() => {
        return chart.getImageBuffer('image/png')
      }).then((buffer) => {
        return chart.getImageStream('image/png')
      }).then((streamResult) => {
        return chart.writeImageToFile('image/png', './src/cache/usergrowth.png')
      }).then(() => {
        Msg.delete()
        msg.channel.send({file: './src/cache/usergrowth.png'}).catch((err) => {reject(err)})
      }).catch((err) => {
        reject(err)
      })
    }).catch((err) => {reject(err)})
  })
}
