exports.data = {
  'name': 'UserGrowth',
  'aliases': ['ug'],
  'desc': 'Showing the growth of the guild with a nice graph!',
  'usage': 'usergrowth'
}

const chartjs = require('chartjs-node')

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    msg.channel.send('Generating Image, this might take a while...').then((Msg) => {

      //Setup variables
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
      //For each member of the current guild
      msg.guild.members.forEach((member) => {

        //Setup date variable
        let date = member.joinedAt

        //Check if the current year of the date already has appeared
        if (dataObject.unsorted[date.getFullYear()]) {

          //Check if the current month and year of the date object have already appeared
          if (dataObject.unsorted[date.getFullYear()][date.getMonth() + 1]) {

            //Add 1 user to that month
            dataObject.unsorted[date.getFullYear()][date.getMonth() + 1]++
          } else {

            //Set the month to 1
            dataObject.unsorted[date.getFullYear()][date.getMonth() + 1] = 1
          }
        } else {

          //Set the month of the date object inside the year of the date object to 1
          dataObject.unsorted[date.getFullYear()] = {[date.getMonth() + 1]: 1}
        }
      })


      //For each year inside the unsorder dataObject
      for (let year in dataObject.unsorted) {

        //For each month of each year
        for (let month in dataObject.unsorted[year]) {

          //Push the sorted stuff. This is not real sorting but everything is sorted before. This is just setting up the data object. Could be done more efficient.
          dataObject.sorted.push({month: month, 'year': year, value: dataObject.unsorted[year][month]})
        }
      }

      //Add the data to the graph objects
      for (let object of dataObject.sorted) {
        graphData.labels.push(object.year + '/' + object.month)
        graphData.datasets[0].data.push(object.value)
        graphData.datasets[1].data.push(object.value + dataObject.preCount)
        dataObject.preCount = object.value + dataObject.preCount
      }

      //Setup chart
      let chart = new chartjs(1920, 1080)

      //Draw the chart using own settings
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

      //Do all this stuff...
      }).then(() => {
        return chart.getImageBuffer('image/png')
      }).then((buffer) => {
        return chart.getImageStream('image/png')
      }).then((streamResult) => {
        return chart.writeImageToFile('image/png', './src/cache/usergrowth.png')
      }).then(() => {

        //Delete old message
        Msg.delete()

        //Send the chart
        msg.channel.send({file: './src/cache/usergrowth.png'}).catch((err) => {reject(err)})
      }).catch((err) => {
        reject(err)
      })
    }).catch((err) => {reject(err)})
  })
}
