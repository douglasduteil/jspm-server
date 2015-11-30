//

import Debug from 'debug'
import parseUrl from 'parseurl'

//

export default mwServeBundles

//

var ALLOWED_METHODS = ['GET', 'HEAD']
const debug = Debug('JSPMServer:mwServeBundles')

// Inspired by https://github.com/expressjs/serve-static/blob/v1.10.0/index.js
function mwServeBundles ({root, system}, jspmServer) {
  if (!system) {
    return function identity (req, res, next) { next() }
  }

  debug('setup')

  const fileCache = jspmServer.builder.__fileCache

  return function _mwServeBundles (req, res, next) {
    if (!ALLOWED_METHODS.includes(req.method)) {
      next()
      return
    }

    const path = parseUrl(req).pathname.substr(1)

    if (!fileCache.has(path)) {
      next()
      return
    }

    debug('matching %s', path)

    var result = fileCache.get(path)
    res.setHeader('Content-Length', Buffer.byteLength(result))
    res.write(new Buffer(result))
    res.end()
  }
}
