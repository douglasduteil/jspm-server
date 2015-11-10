//

import connect from 'connect'
import morgan from 'morgan'
import path from 'path'
import portscanner from 'portscanner'
import serveStatic from 'serve-static'
import spdy from 'spdy'

//

export default function http2Server ({log, options}) {
  const app = connect()

  if (options.verbose) {
    app.use(morgan('dev'))
  }

  // app.use(bundlingStrategy(options))

  log.info(`Serving files from: ${path.relative(process.cwd(), options.root)}`)
  app.use(serveStatic(options.root))

  const server = spdy.createServer(options.serverOptions, app)
  return server
}
