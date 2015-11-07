'use strict'

var path = require('path')
var fs = require('fs')

var rootPath = path.resolve.bind(path, __dirname, '..')

module.exports = {
  ssl: {
    ca: rootPathReadSync('ssl/ca.crt'),
    cert: rootPathReadSync('ssl/server.crt'),
    key: rootPathReadSync('ssl/server.key')
  }
}

//

function rootPathReadSync (path) {
  return fs.readFileSync(rootPath(path))
}
