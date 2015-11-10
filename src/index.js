//

import 'babel-polyfill'

//

import http2Server from './http2Server'
import logApiUrls from './logApiUrls'
import logger from './logger'
import parseOptions from './parseOptions'
import resolvePortNumberAsync from './resolvePortNumberAsync'

//

export default class JSPMServer {
  constructor (...options) {
    this.options = parseOptions(...options)
    this.log = logger(this.options)
  }

  start () {
    Promise.resolve()
      .then(resolvePortNumberAsync.bind(null, this.options))
      .then((port) => this.options.port = port)
      .then(logApiUrls.bind(null, this.log, this.options))

      .then(() => this)
      .then(function startHttp2Server (instance) {
        const options = instance.options
        const server = http2Server(instance)
        server.listen(options.port, options.hostname)
        return server
      })
      .then((server) => this.http2Server = server)
      .catch((err) => {
        this.log.error(err)
        process.exit(1)
      })
  }
}

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
