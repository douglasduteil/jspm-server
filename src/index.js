//

import 'babel-polyfill'
import connect from 'connect'
import morgan from 'morgan'
import portscanner from 'portscanner'
import spdy from 'spdy'
import ary from 'lodash.ary'

//

import {staticStrategy} from './server'

//

export default server

//

function server (...optionsArr) {
  const options = optionsArr.reduce(ary(Object.assign), {})
  return {start, init, options}

  function init () {
    const app = connect()

    if (options.verbose) {
      app.use(morgan('dev'))
    }

    app.use(staticStrategy(options))

    return app
  }

  function start (app, callback) {
    callback = callback || function () {}

    let serverOptions = {
      spdy: {
        plain: !options.ssl
      }
    }

    if (options.ssl) {
      serverOptions = options.ssl
    }

    portscanner.findAPortNotInUse(
      options.port,
      options.port + 1000,
      options.hostname,
      portFound)

    function portFound (error, port) {
      if (error) {
        console.error(error)
        return callback(error)
      }

      const server = spdy.createServer(serverOptions, app)
      server.listen(port, options.hostname, function (request, response) {
        callback(null, server, options.hostname, port)
      })
    }
  }
}
