//

import connect from 'connect'
import morgan from 'morgan'
import path from 'path'
import serveStatic from 'serve-static'
import spdy from 'spdy'

import transformerFiles from './transformerFiles'
import appendDepCache from './appendDepCache'

//

export default function http2Server (jspmServer) {
  const {options} = jspmServer
  const app = connect()

  if (options.verbose) {
    app.use(morgan('dev'))
  }

  // app.use(bundlingStrategy(options))
  app.use(appendDepCache(options, jspmServer))
  app.use(transformerFiles(options, jspmServer))
  app.use(serveStatic(path.resolve(process.cwd(), options.root)))

  const server = spdy.createServer(options.serverOptions, app)
  return server
}
