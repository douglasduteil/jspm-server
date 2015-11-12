//

import 'babel-polyfill'
import path from 'path'

//

import InnerBuilder from './innerBuilder'
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

    this.log.debug(__filename, 'options')
    console.dir(this.options)
  }

  start () {
    return Promise.resolve()
      // Find available port
      .then(resolvePortNumberAsync.bind(null, this.options))
      .then((port) => this.options.port = port)

      // Create Self Certif
      .then(() => {
        if (!this.options.ssl) { return }
        const pem = require('pem')
        return new Promise(function (resolve, reject) {
          pem.createCertificate({days: 356, selfSigned: true}, function (err, keys) {
            if (err) {
              reject(err)
              return
            }
            resolve(keys)
          })
        }).then((keys) => {
          this.options.serverOptions = {}
          this.options.serverOptions.ssl = {key: keys.serviceKey, cert: keys.certificate}
        })
      })

      // Display it
      .then(logApiUrls.bind(null, this.log, this.options))

      // Setup inner builder
      .then(() => this)
      .then(function instanciateBuilder (jspmServer) {
        jspmServer.builder = new InnerBuilder(jspmServer.options.root, jspmServer.options.system.configFile)
      })

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

      // Error handler
      .catch((err) => {
        this.log.error('Error : ')
        this.log.error(err)
        throw err
      })
  }
}
