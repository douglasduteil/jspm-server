//

import micromatch from 'micromatch'
import parseUrl from 'parseurl'
import hijackResponse from 'hijackresponse'

import INJECTED_SCRIPT_NAME from './INJECTED_SCRIPT_NAME'
//

export default appendDepCache

//

var ALLOWED_METHODS = ['GET']
var BODY_MATCH = /<body[^>]*>/i

// Inspired by https://github.com/expressjs/serve-static/blob/v1.10.0/index.js
function appendDepCache ({root, system}, jspmServer) {
  if (!system) {
    return function identity (req, res, next) { next() }
  }

  const isMatching = micromatch.filter(['*.html'])

  return function _appendDepCache (req, res, next) {
    if (!ALLOWED_METHODS.includes(req.method)) {
      next()
      return
    }

    const originalUrl = parseUrl.original(req)
    let path = parseUrl(req).pathname.substr(1)
    if (path === '/' && originalUrl.pathname.substr(-1) !== '/') {
      path = ''
    }

    if (!isMatching(path) && path !== '') {
      next()
      return
    }

    hijackResponse(res, addDepCaceToTheResponse(next))
    next()
  }
}

//

function addDepCaceToTheResponse (next) {
  return function (err, res) {
    if (err) {
      res.unhijack()
      next(err)
      return
    }

    const chunks = []

    res.on('data', function (chunk) {
      chunks.push(chunk)
    })

    res.on('end', function () {
      var result = Buffer.concat(chunks).toString('utf-8')

      if (BODY_MATCH.test(result)) {
        const script = `<script src="${INJECTED_SCRIPT_NAME}"></script>`
        result = result.replace(new RegExp('<!--\\s*__jspm__\\s*-->', 'i'), script)
      }

      res.setHeader('Content-Length', Buffer.byteLength(result))
      res.write(new Buffer(result))
      res.end()
    })
  }
}
