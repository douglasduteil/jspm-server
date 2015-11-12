//

import merge from 'lodash.merge'
import path from 'path'
import fs from 'fs'

//

export default parseOptions

//

var DEFAULT_CONFIG = {
  cwd: process.cwd()
}

var ROOT_PATH = path.resolve.bind(path, __dirname, '..')

function parseOptions (...optionsArr) {
  return optionsArr.reduce(function (last, oprtion) {
    return merge(last, parseOption(oprtion))
  }, Object.assign({}, DEFAULT_CONFIG))
}

function parseOption (options) {
  const userConfig = options.config ? require(path.resolve(options.config)) : {}
  options = merge(options, userConfig)

  //options.serverOptions = defineServerOptions(options)
  options.root = path.resolve(options.cwd, options.root)
  options.protocol = `http${options.ssl ? 's' : ''}`
  return options
}

function defineServerOptions (options) {
  if (!options.ssl) {
    return {spdy: {plain: true}}
  }

  return {
    spdy: {plain: false},
    ssl: {
      ca: rootPathReadSync('ssl/ca.crt'),
      cert: rootPathReadSync('ssl/server.crt'),
      key: rootPathReadSync('ssl/server.key')
    }
  }
}

function rootPathReadSync (path) {
  return fs.readFileSync(ROOT_PATH(path), 'utf8')
}
