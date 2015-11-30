//

import Debug from 'debug'
import etag from 'etag'
import parseUrl from 'parseurl'

import depCacheScriptTemplate from './depCacheScriptTemplate'
import INJECTED_SCRIPT_NAME from './INJECTED_SCRIPT_NAME'

//

export default mwServeInjectionScript

//

var ALLOWED_METHODS = ['GET', 'HEAD']
const debug = Debug('JSPMServer:mwServeInjectionScript')

// Inspired by https://github.com/expressjs/serve-static/blob/v1.10.0/index.js
function mwServeInjectionScript ({root, system}, jspmServer) {
  if (!system) {
    return function identity (req, res, next) { next() }
  }

  debug('setup')

  const {builder} = jspmServer

  return function _mwServeInjectionScript (req, res, next) {
    if (!ALLOWED_METHODS.includes(req.method)) {
      next()
      return
    }

    const path = parseUrl(req).pathname.substr(1)

    if (path !== INJECTED_SCRIPT_NAME) {
      next()
      return
    }

    debug('matching %s', path)

    Promise.resolve()
      .then(resolveCache(builder))
      .then(sendUpCachedData.bind(null, res))
      .catch(next)
  }

  function sendUpCachedData (res, configObject) {
    var {
      __dependenciesTraceCacheLastModified: dependenciesTraceCacheLastModified,
      __injectionCacheLastModified: injectionCacheLastModified
    } = builder

    var lastModifiedDate = new Date(Math.max(
      Number(dependenciesTraceCacheLastModified),
      Number(injectionCacheLastModified)
    ))

    var result = depCacheScriptTemplate(configObject)
    // TODO(@douglasduteil): uniform cache time
    res.setHeader('Cache-Control', 'public, max-age=' + 31536000)
    // TODO(@douglasduteil): cache timers
    res.setHeader('Content-Type', 'application/javascript')
    res.setHeader('Content-Length', Buffer.byteLength(result))
    res.setHeader('ETag', etag(result))
    res.setHeader('Last-Modified', lastModifiedDate.toUTCString())
    res.write(new Buffer(result))
    res.end()
  }
}

//

function resolveCache (builder) {
  const {
    __dependenciesTraceCache: dependenciesTraceCache,
    __injectionCache: injectionCache
  } = builder

  return function traceAll () {
    return {
      depCache: objectifyMap(dependenciesTraceCache),
      bundles: objectifyMap(injectionCache)
    }
  }

  //

  function objectifyMap (map) {
    return Array.from(map).reduce(mapPairToObject, {})
  }
}

function mapPairToObject (obj, [first, last]) {
  obj[first] = last
  return obj
}
