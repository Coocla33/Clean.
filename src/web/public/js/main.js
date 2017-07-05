$(function() {
  let socket = io.connect()

  socket.emit('getStats')
  socket.emit('getCommands')

  let options = {
    'useEasing': true,
    'useGrouping': true,
    'separator': '.',
    'decimal': ',',
    'prefix': '',
    'suffix': ''
  }

  socket.on('updateStats', (stats) => {
    let userCountUp = new CountUp('user-count', 0, stats.userCount, 0, 5)
    let guildCountUp = new CountUp('guild-count', 0, stats.guildCount, 0, 5)
    let channelCountUp = new CountUp('channel-count', 0, stats.channelCount, 0, 5)

    userCountUp.start()
    guildCountUp.start()
    channelCountUp.start()
  })

  socket.on('updateCommands', (data) => {
    let cache = []
    let commandContainer = $('#command-container')
    for (let type in data) {
      for (let command in data[type]) {
        if (type != 'unlisted' && type !='developer') {
          let htmlObject = []
          let badge = {'color': '', 'type': ''}
          if (data[type][command].new) {
            badge.color = 'green'
            badge.type = 'New'
          } else if (data[type][command].indev) {
            badge.color = 'red'
            badge.type = 'Indev'
          } else if (data[type][command].dm) {
            badge.color = 'orange'
            badge.type = 'DM'
          }

          if (badge.type != '') {
            htmlObject.push('<h3 class="commandName">' + data[type][command].name + ' <span class="badge commandBadge badge-' + badge.color + '">' + badge.type + '</span></h3>')
          } else {
            htmlObject.push('<h3 class="commandName">' + data[type][command].name + '</h3>')
          }
          if (data[type][command].aliases) {
            htmlObject.push('<h6 style="color: #a7a7a7; margin-top: -8px;">' + data[type][command].aliases.join(', ') + '</h6>')
          } else {
            htmlObject.push('<h6 style="color: #a7a7a7; margin-top: -8px;">No Aliases</h6>')
          }
          htmlObject.push('<hr style="margin: 8px;">')
          htmlObject.push('<p>' + data[type][command].desc + '</p>')
          cache.push(htmlObject.join(''))
        }
      }
    }

    let objectsLeft = cache.length - Math.floor(cache.length / 4) * 4
    let final = []
    let offset = 0.2
    for (let i in cache) {
      if (i >= cache.length - objectsLeft) {
        if (objectsLeft == 1) {
          final.push('<div class="col-md-12 commandAnimation" style="animation-delay: ' + offset + 's";>' + cache[i] + '</div>')
          offset += 0.2
        } else if (objectsLeft == 2) {
          final.push('<div class="col-md-6 commandAnimation" style="animation-delay: ' + offset + 's";>' + cache[i] + '</div>')
          offset += 0.2
        } else {
          final.push('<div class="col-md-4 commandAnimation commandAnimation" style="animation-delay: ' + offset + 's";>' + cache[i] + '</div>')
          offset += 0.2
        }
      } else {
        final.push('<div class="col-md-3 commandAnimation" style="animation-delay: ' + offset + 's";>' + cache[i] + '</div>')
        offset += 0.2
      }
    }
    commandContainer.html(final.join(''))
  })
})
