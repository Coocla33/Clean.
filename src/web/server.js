const express = require('express')
const app = express()

app.use(express.static(__dirname + '/public'))

const server = require('http').createServer(app)
const io = require('socket.io').listen(server)

let connections = [];

exports.run = function() {
  return new Promise((resolve, reject) => {
    server.listen(config.web.port)
    resolve('Listening on port ' + config.web.port + '.')
    setTimeout(updateUptime, 1000)
  })
}

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html')
})

//Connection
io.sockets.on('connection', function(socket) {
  connections.push(socket)
  console.log(handlers.logger.web(new Date()) + 'Socket Connect. Count: ' + connections.length + ' (' + socket.handshake.address.split(':')[socket.handshake.address.split(':').length - 1] + ')')

  //Disconnect
  socket.on('disconnect', function(socket) {
    connections.splice(connections.indexOf(socket), 1)
    console.log(handlers.logger.web(new Date()) + 'Socket Disconnect. Count: ' + connections.length)
  })

  //Get Statistics
  socket.on('getStats', function() {
    io.sockets.emit('setStats', {'userCount': bot.users.size, 'guildCount': bot.guilds.size, 'channelCount': bot.channels.size, 'commandCount': data.usage, 'uptime': handlers.misc.msToRead(bot.uptime)})
  })

  //Get Commands
  socket.on('getCommands', function() {
    let data = {}
    for (let type in commands.all) {
      data[type] = []
      for (let command in commands.all[type]) {
        let commandObject = {}
        command = commands.all[type][command]
        commandObject.name = command.data.name
        commandObject.desc = command.data.desc
        commandObject.usage = command.data.usage
        if (command.data.aliases) {
          commandObject.aliases = command.data.aliases
        }
        if (command.data.permissions) {
          commandObject.permissions = command.data.permissions
        }
        if (command.data.dm) {
          commandObject.dm = command.data.dm
        }
        if (command.data.indev) {
          commandObject.indev = command.data.indev
        }
        if (command.data.new) {
          commandObject.new = command.data.new
        }
        data[type].push(commandObject)
      }
    }
    socket.emit('updateCommands', data)
  })
})

exports.updateStats = function() {
  io.sockets.emit('updateStats', {'userCount': bot.users.size, 'guildCount': bot.guilds.size, 'channelCount': bot.channels.size, 'commandCount': data.usage, 'uptime': handlers.misc.msToRead(bot.uptime)})
}
