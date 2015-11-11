'use strict'

var babel = require('babel-core')
var fs = require('fs')
var path = require('path')
const BABELRC_FILENAME = '.babelrc'

module.exports = {
  root: __dirname,
  serverOptions: {
    spdy: {
      plain: true
    }
  },
  transformers: [
    {
      files: {
        // https://www.npmjs.com/package/micromatch#matcher
        pattern: '*.js'
      },
      transformer: babelify({ presets: ['es2015'] })
    }
  ]
}

function babelify (options) {
  if (options.cwd) {
    const configLoc = path.join(options.cwd, BABELRC_FILENAME)
    const content = fs.readFileSync(configLoc, 'utf8')
    options = JSON.parse(content)
  }

  return function babelifyTransform (source, relativePath) {
    console.log(__filename, '#babelifyTransform', '.source', source)
    return babel.transform(source, options).code
  }
}
