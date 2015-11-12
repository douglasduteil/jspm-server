//

import ary from 'lodash.ary'
import micromatch from 'micromatch'
import path from 'path'
import parseUrl from 'parseurl'
import hijackResponse from 'hijackresponse'

import depCacheScriptTemplate from './depCacheScriptTemplate'
import INJECTED_SCRIPT_NAME from './INJECTED_SCRIPT_NAME'

//

export default interpretInjectionScript

//

var ALLOWED_METHODS = ['GET', 'HEAD']

// Inspired by https://github.com/expressjs/serve-static/blob/v1.10.0/index.js
function interpretInjectionScript ({root, system}, jspmServer) {
  if (!system) {
    return function identity (req, res, next) { next() }
  }
  console.info(__filename, 'interpretInjectionScript')

  const {builder} = jspmServer
  const cache = new Map()

  return function _interpretInjectionScript (req, res, next) {
    if (!ALLOWED_METHODS.includes(req.method)) {
      next()
      return
    }

    const path = parseUrl(req).pathname.substr(1)

    if (path !== INJECTED_SCRIPT_NAME) {
      next()
      return
    }

    resolveCache({
      builder,
      cache,
      dependencies: system.depCache
    }, next)()
      .then(sendUpCachedData.bind(null, res))
  }

  function sendUpCachedData (res) {
    var result = depCacheScriptTemplate(mapToObject(cache))
    res.setHeader('Content-Length', Buffer.byteLength(result))
    res.write(new Buffer(result))
    res.end()
  }
}

//

function resolveCache (options, next) {
  const {
    builder,
    cache,
    dependencies
  } = options

  return function traceAll () {
    return Promise.resolve(dependencies[0])
      .then(function cacheOrTrace (expression) {
        return cache.get(expression) ||
          builder.trace(expression)
            .then(Object.keys)
            .then(function removeSelf (depCache) {
              return depCache.filter((dep) => dep !== expression)
            })
            .then(function cacheIt (depCache) {
              cache.set(expression, depCache)
              return depCache
            })
      })
      .catch(next)
  }
}

function mapToObject (map) {
  const obj = {}
  for (let [k, v] of map) {
    obj[k] = v
  }
  return obj
}
