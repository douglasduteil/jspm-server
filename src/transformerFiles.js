//

import ary from 'lodash.ary'
import micromatch from 'micromatch'
import parseUrl from 'parseurl'
import hijackResponse from 'hijackresponse'
import Builder from 'systemjs-builder'

//

export default transcludeFiles

//

var ALLOWED_METHODS = ['GET', 'HEAD']

// Inspired by https://github.com/expressjs/serve-static/blob/v1.10.0/index.js
function transcludeFiles ({configFiles}, jsv) {
  var builder = new Builder()
  Promise.all(configFiles.map(ary(builder.loadConfig, 1)))
    .then(function configFilesLoaded() {
      jsv.debug(__filename, '#configFilesLoaded', configFiles)
    })
  console.log(, transformers)
  transformers = transformers.map(instanciateMatcherPerTransformer)
  return function transcludeFile (req, res, next) {
    if (!ALLOWED_METHODS.includes(req.method)) {
      next()
      return
    }

    var path = parseUrl(req).pathname.substr(1)
    var valideTransformers = transformers
      .filter(({_isMatching}) => _isMatching(path))
      .map(({transformer}) => transformer)

    if (!valideTransformers.length) {
      next()
      return
    }

    // create send stream
    hijackResponse(res, function (err, res) {
      if (err) {
        res.unhijack()
        next(err)
        return
      }

      applyTransformationTo(path, valideTransformers)
      .then(function (result) {
        res.setHeader('Content-Length', Buffer.byteLength(result))
        res.end(result)
      })
    })
    return next()
  }
}

//

function applyTransformationTo (path, transformers) {
  return transformers.reduce(
    (source, transforme) => source.then(transforme),
    Promise.resolve(path)
  )
}

function instanciateMatcherPerTransformer (transformer) {
  const {files} = transformer
  transformer._isMatching = micromatch.filter(files.pattern, files.options)
  return transformer
}
