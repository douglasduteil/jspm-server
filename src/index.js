//

import 'babel-polyfill'
import connect from 'connect'
import fs from 'fs'
import morgan from 'morgan'
import portscanner from 'portscanner'
import send from 'send'
import spdy from 'spdy'
import url from 'url'

//

export default server

//

function server (userOptions) {
  return {start, init}

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
    const options = {
      ...userOptions.http2,
      ca: fs.readFileSync(userOptions.http2.ca),
      cert: fs.readFileSync(userOptions.http2.cert),
      key: fs.readFileSync(userOptions.http2.key)
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
