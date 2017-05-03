const chalk = require('chalk')

exports.error = function(date, command) {
  return logTime(date) + chalk.bold.red('[ERROR: ' + command + '] ')
}

exports.info = function(date) {
  return logTime(date) + chalk.bold.yellow('[INFO] ')
}

exports.web = function(date) {
  return logTime(date) + chalk.bold.magenta('[WEB] ')
}

exports.connect = function(date) {
  return logTime(date) = chalk.bold.green('[CONNECTION] ')
}

let logTime = function(date) {
  let seconds = date.getSeconds()
  let minutes = date.getMinutes()
  let hours = date.getHours()
  if (seconds < 10) {seconds = '0' + seconds}
  if (minutes < 10) {minutes = '0' + minutes}
  if (hours < 10) {hours = '0' + hours}
  return chalk.bold.cyan('[' + date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' - ' + hours + ':' + minutes + ':' + seconds + '] ')
}
