//

import 'babel-polyfill'
import path from 'path'

//

import InnerBuilder from './innerBuilder'
import http2Server from './http2Server'
import logApiUrls from './logApiUrls'
import logger from './logger'
import parseOptions from './parseOptions'
import preBundle from './preBundle'
import preTraceDependencies from './preTraceDependencies'
import resolvePortNumberAsync from './resolvePortNumberAsync'
import Debug from 'debug'

//

const debug = Debug('JSPMServer')

export default class JSPMServer {
  constructor (...options) {
    this.options = parseOptions(...options)
    this.log = logger(this.options)
  }

  start () {
    return Promise.resolve()
      // Find available port
      .then(resolvePortNumberAsync.bind(null, this.options))
      .then((port) => this.options.port = port)
      .then(() => debug('resolve with port %d', this.options.port))

      // Display it
      .then(logApiUrls.bind(null, this.log, this.options))

      // Setup inner builder
      .then(() => this)
      .then(function instanciateBuilder (jspmServer) {
        debug('instantiate builder')
        jspmServer.builder = new InnerBuilder(jspmServer.options.root, jspmServer.options.system.configFile)
      })

      // Pre process on builder
      .then(() => this)
      .then(function preProcessesOnBuilder (jspmServer) {
        debug('Pre bundle expressions')
        jspmServer.log.info('Caching data...')
        return Promise.all([
          preBundle(jspmServer.builder)(jspmServer.options.system),
          preTraceDependencies(jspmServer.builder)(jspmServer.options.system)
        ])
      })

      // Initial server
      .then(() => this)
      .then(function startHttp2Server (jspmServer) {
        debug('initiate server')
        const options = jspmServer.options
        const server = http2Server(jspmServer)
        var relativeRoot = path.relative(process.cwd(), options.root)
        server.listen(options.port, options.hostname, function () {
          debug('server listening')
          jspmServer.log.info(`Server ready`)
          jspmServer.log.info(`Serving files from: ${relativeRoot.length ? relativeRoot : './'}`)
        })
        return server
      })
      .then((server) => this.http2Server = server)

      // Error handler
      .catch((err) => {
        debug('[ERROR] %s', err)
        this.log.error('Error : ')
        this.log.error(err)
        throw err
      })
  }
}
