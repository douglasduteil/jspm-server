//

import 'babel-polyfill'
import path from 'path'

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
      // Options post traitment
      .then(resolvePortNumberAsync.bind(null, this.options))
      .then((port) => this.options.port = port)
      .then(logApiUrls.bind(null, this.log, this.options))

      // Initial server
      .then(() => this)
      .then(function startHttp2Server (jspmServer) {
        const options = jspmServer.options
        const server = http2Server(jspmServer)
        var relativeRoot = path.relative(process.cwd(), options.root)
        server.listen(options.port, options.hostname, function () {
          jspmServer.log.info(`Serving files from: ${relativeRoot.length ? relativeRoot : './'}`)
        })
        return server
      })
      .then((server) => this.http2Server = server)
      .catch((err) => {
        this.log.error(err)
        process.exit(1)
      })
  }
}
