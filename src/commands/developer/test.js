exports.data = {
  'name': 'Test',
  'desc': 'Test code',
  'usage': 'test [dunnno, might be something here? help]',
  'dm': true,
  'permissions': []
}

const chartjs = require('chartjs-node')

exports.run = function(msg, data) {
  return new Promise((resolve, reject) => {
    let data = {
    	"labels": ["2016 - 40", "2016 - 42", "2016 - 43", "2016 - 48", "2016 - 49", "2016 - 51", "2016 - 52", "2016 - 53", "2016 - 54", "2017 - 2", "2017 - 3", "2017 - 4", "2017 - 5", "2017 - 6", "2017 - 7", "2017 - 8", "2017 - 9", "2017 - 10", "2017 - 11", "2017 - 12", "2017 - 13", "2017 - 14", "2017 - 15", "2017 - 16", "2017 - 17", "2017 - 18", "2017 - 19"],
    	"datasets": [{
    		"label": "Guild Growth",
    		"fill": true,
    		"lineTension": 0.1,
    		"backgroundColor": "rgba(219, 52, 124, 0.4)",
    		"borderColor": "rgb(219, 52, 124)",
    		"borderCapStyle": "butt",
    		"borderDash": [],
    		"borderDashOffset": 0,
    		"borderJoinStyle": "miter",
    		"pointBorderColor": "rgb(219, 52, 124)",
    		"pointBackgroundColor": "#fff",
    		"pointBorderWidth": 2,
    		"pointHoverRadius": 5,
    		"pointHoverBackgroundColor": "rgb(219, 52, 124)",
    		"pointHoverBorderColor": "rgba(220,220,220,1)",
    		"pointHoverBorderWidth": 2,
    		"pointRadius": 3,
    		"pointHitRadius": 10,
    		"data": [1, 2, 3, 1, 4, 1, 5, 3, 2, 5, 4, 10, 42, 56, 82, 66, 89, 41, 9, 18, 5, 4, 12, 2, 13, 11, 7],
    		"spanGaps": false
    	}, {
    		"label": "Guild Count",
    		"fill": true,
    		"lineTension": 0.1,
    		"backgroundColor": "rgba(52, 152, 219, 0.4)",
    		"borderColor": "rgb(52, 152, 219)",
    		"borderCapStyle": "butt",
    		"borderDash": [],
    		"borderDashOffset": 0,
    		"borderJoinStyle": "miter",
    		"pointBorderColor": "rgb(52, 152, 219)",
    		"pointBackgroundColor": "#fff",
    		"pointBorderWidth": 2,
    		"pointHoverRadius": 5,
    		"pointHoverBackgroundColor": "rgb(52, 152, 219)",
    		"pointHoverBorderColor": "rgba(220,220,220,1)",
    		"pointHoverBorderWidth": 2,
    		"pointRadius": 3,
    		"pointHitRadius": 10,
    		"data": [1, 3, 6, 7, 11, 12, 17, 20, 22, 27, 31, 41, 83, 139, 221, 287, 376, 417, 426, 444, 449, 453, 465, 467, 480, 491, 498],
    		"spanGaps": false
    	}]
    }

    let chart = new chartjs(1024, 512)
    chart.drawChart({
      'type': 'line',
      'data': data,
      'options': {}
    }).then(() => {
      return chart.getImageBuffer('image/png')
    }).then((buffer) => {
      return chart.getImageStream('image/png')
    }).then((streamResult) => {
      return chart.writeImageToFile('image/png', './test.png')
    }).then(() => {
      msg.channel.sendFile('./test.png')
    }).catch((err) => {
      reject(err)
    })
  })
}
