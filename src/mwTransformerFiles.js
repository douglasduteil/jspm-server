//

import Debug from 'debug'
import micromatch from 'micromatch'
import parseUrl from 'parseurl'
import hijackResponse from 'hijackresponse'

//

export default mwTransformerFiles

//

const debug = Debug('JSPMServer:mwTransformerFiles')

var ALLOWED_METHODS = ['GET', 'HEAD']

// Inspired by https://github.com/expressjs/serve-static/blob/v1.10.0/index.js
function mwTransformerFiles ({root, transformer}, jspmServer) {
  if (!transformer) {
    return function identity (req, res, next) { next() }
  }

  debug('setup')

  var {builder} = jspmServer
  var {files} = transformer

  return function _mwTransformerFiles (req, res, next) {
    if (!ALLOWED_METHODS.includes(req.method)) {
      next()
      return
    }

    var path = parseUrl(req).pathname.substr(1)

    if (!micromatch.any(path, files.pattern)) {
      next()
      return
    }

    debug('matching "%s"', path)

    hijackResponse(res, hijackedResponse(builder, path, next))
    next()
  }
}

//

function hijackedResponse (builder, path, next) {
  var compile = compiler(builder)

  return function (err, res) {
    if (err) {
      res.unhijack()
      next(err)
      return
    }

    res.setHeader('X-Hijacked', 'yes!')
    res.removeHeader('Content-Length')

    res.on('data', function () {})
      .on('end', resolveResponse.bind(null, res))
  }

  function resolveResponse (res) {
    return Promise.resolve(path)
      .then(compile)
      // TODO(@douglasduteil): PUSH the sourcemap
      .then(function extractContent (result) { return result.source })
      .then(function respondWithResult (content) {
        debug('respond with transformed content for "%s"', path)
        res.end(content)
      })
  }
}

function compiler (builder) {
  const compiledFilesCache = builder.__compiledFilesCache

  return function compile (path) {
    return Promise.resolve(path)
      .then(function testIfInCache (path) {
        var isCached = compiledFilesCache.has(path)
          ? Promise.resolve.bind(Promise)
          : Promise.reject.bind(Promise)
        return isCached(path)
      })
      .then(function getFormCache (path) {
        debug('get from cache "%s"', path)
        return compiledFilesCache.get(path)
      })
      .catch(compileAndCache)
  }

  //

  function compileAndCache (path) {
    debug('compile "%s"', path)
    return builder.compile(path)
      .then(function cacheIt (result) {
        debug('cache "%s"', path)
        compiledFilesCache.set(path, result)
        return result
      })
  }
}
