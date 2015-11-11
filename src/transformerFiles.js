//

import ary from 'lodash.ary'
import micromatch from 'micromatch'
import path from 'path'
import parseUrl from 'parseurl'
import hijackResponse from 'hijackresponse'
import Builder from 'systemjs-builder'

//

export default transcludeFiles

//

var ALLOWED_METHODS = ['GET', 'HEAD']

// Inspired by https://github.com/expressjs/serve-static/blob/v1.10.0/index.js
function transcludeFiles ({root, transformer}, jspmServer) {
  if (!transformer) {
    return function identity (req, res, next) { next() }
  }

  var {files, configFiles} = transformer
  var builder = new Builder()
  var doneLoading = Promise.all(
      configFiles
      .map(ary(path.resolve.bind(path, root), 1))
      .map((configFile) => builder.loadConfig(configFile))
    )
    .catch(function (err) {
      jspmServer.error(err)
      throw err
    })

  var isMatching = micromatch.filter(files.pattern, files.options)

  return function transcludeFile (req, res, next) {
    doneLoading.then(function () {
      if (!ALLOWED_METHODS.includes(req.method)) {
        next()
        return
      }

      var path = parseUrl(req).pathname.substr(1)

      if (!isMatching(path)) {
        next()
        return
      }

      hijackResponse(res, bundleTheResponse(builder, path, next))
      next()
    })
  }
}

//

function bundleTheResponse (builder, path, next) {
  return function (err, res) {
    if (err) {
      res.unhijack()
      next(err)
      return
    }

    builder.compile(path)
      .then(function (result) {
        const code = result.source
        res.setHeader('Content-Length', Buffer.byteLength(code))
        res.end(code)
        next()
      })
  }
}
