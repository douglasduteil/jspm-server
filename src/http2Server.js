//

import connect from 'connect'
import compression from 'compression'
import Debug from 'debug'
import morgan from 'morgan'
import path from 'path'
import serveStatic from 'serve-static'
import spdy from 'spdy'

import mwAddInjectionScript from './mwAddInjectionScript'
import mwServeBundles from './mwServeBundles'
import mwServeInjectionScript from './mwServeInjectionScript'
import mwTransformerFiles from './mwTransformerFiles'

//

const debug = Debug('JSPMServer:http2Server')

//

export default function http2Server (jspmServer) {
  const {options} = jspmServer
  const app = connect()

  if (options.verbose || process.env.DEBUG) {
    app.use(morgan('dev'))
  }

  app.use(compression({ threshold: 0 }))

  app.use(mwServeBundles(options, jspmServer))
  app.use(mwServeInjectionScript(options, jspmServer))

  app.use(mwAddInjectionScript(options, jspmServer))
  app.use(mwTransformerFiles(options, jspmServer))

  const staticPath = path.resolve(process.cwd(), options.root)
  debug('serveStatic on %s', staticPath)
  // TODO(@douglasduteil): uniform cache time
  app.use(serveStatic(staticPath, {maxAge: Infinity}))

  // debug('serverOptions %j', options.serverOptions)
  const server = spdy.createServer(options.serverOptions, app)
  return server
}
