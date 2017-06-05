//Require NODE modules
const fs = require('fs')
const path = require('path')

//Handlers setup
exports.setup = function() {
  return new Promise((resolve, reject) => {

    //Setup variables
    let handlers = {}
    let handlersFile = fs.readdirSync(__dirname)

    //For each handler of handlersFile array
    for (let handler of handlersFile) {

      //If the handler is a .js file
      if (handler.endsWith('.js')) {
        try {

          //Require the .js file and add it to the handlers object
          handlers[handler.slice(0, -3)] = require('./' + handler)
        } catch(err) {

          //Error handleing
          reject(err)
        }
      }
    }

    //Resolve the handlers
    resolve(handlers)
  })
}

//Handlers Reload
exports.reload = function(handler) {
  return new Promise((resolve, reject) => {

    //Lowercase handler property
    handler = handler.toLowerCase()

    //Setup Variables
    let handlersFile = fs.readdirSync(__dirname)

    //Check if handler is inside the handlersFile array
    if (handlersFile.indexOf(handler + '.js') > -1) {
      try {

        //Delete cache of the old handler
        delete require.cache[path.join(__dirname, handler + '.js')]

        //Require new handler
        let newHandler = require(path.join(__dirname, handler + '.js'))

        //Set new handler as global
        global.handlers[handler] = newHandler

        //Resolve
        resolve('Reloaded')
      } catch(err) {

        //Error handleing
        reject(err)
      }
    } else {

      //Error handleing
      reject('Handler Does Not Exist')
    }
  })
}
