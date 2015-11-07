//

import 'babel-polyfill'
import connect from 'connect'
import morgan from 'morgan'
import portscanner from 'portscanner'
import send from 'send'
import spdy from 'spdy'
import url from 'url'
import ary from 'lodash.ary'

//

export default server

//

function server (...options) {
  const userOptions = options.reduce(ary(Object.assign), {})
  return {start, init, options: userOptions}

  function init () {
    const app = connect()

    if (userOptions.verbose) {
      app.use(morgan('dev'))
    }

    app.use(staticServer(userOptions.root))

    return app
  }

  function start (app, callback) {
    callback = callback || function () {}

    let options = {
      spdy: {
        plain: !userOptions.ssl
      }
    }

    if (userOptions.ssl) {
      options = userOptions.ssl
    }

    portscanner.findAPortNotInUse(
      userOptions.port,
      userOptions.port + 1000,
      userOptions.hostname,
      portFound)

    function portFound (error, port) {
      if (error) {
        console.error(error)
        return callback(error)
      }

      const server = spdy.createServer(options, app)
      server.listen(port, userOptions.hostname, function (request, response) {
        callback(null, server, userOptions.hostname, port)
      })
    }
  }
}

function staticServer (root) {
  const SUPPORTED_METHODS = ['GET', 'HEAD']
  return function staticRequest (req, res, next) {
    if (!SUPPORTED_METHODS.includes(req.method)) {
      return next()
    }

    const reqpath = url.parse(req.url).pathname

    send(req, reqpath, { root: root })
      // .on('error', error)
      // .on('directory', directory)
      // .on('file', file)
      // .on('stream', inject)
      .pipe(res)
  }
}
