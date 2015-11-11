//

import ary from 'lodash.ary'
import micromatch from 'micromatch'
import path from 'path'
import parseUrl from 'parseurl'
import hijackResponse from 'hijackresponse'

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

  const {builder} = jspmServer
  jspmServer.log.debug(__filename, '#appendDepCache', 'jspmServer.builder')
  console.dir(jspmServer.builder)

  return function _appendDepCache (req, res, next) {
    if (!ALLOWED_METHODS.includes(req.method)) {
      next()
      return
    }

    var path = parseUrl(req).pathname.substr(1)

    console.log(__filename, '#_appendDepCache', 'root')
    console.dir(root)
    console.log(__filename, '#_appendDepCache', 'path')
    console.dir(path)
    console.log(__filename, '#_appendDepCache', 'path')
    builder.trace(system.depCache[0])
      .then(function (tree) {
        console.dir(tree)
      })

    next()
  }
}
