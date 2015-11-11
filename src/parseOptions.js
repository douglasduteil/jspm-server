//

import merge from 'lodash.merge'
import path from 'path'

//

export default parseOptions

//

var DEFAULT_CONFIG = {
  cwd: process.cwd(),
  serverOptions: {
    spdy: {
      plain: true
    }
  }
}

function parseOptions (...optionsArr) {
  return optionsArr.reduce(function (last, oprtion) {
    return merge(last, parseOption(oprtion))
  }, Object.assign({}, DEFAULT_CONFIG))
}

function parseOption (options) {
  const userConfig = options.config ? require(path.resolve(options.config)) : {}
  options = merge(options, userConfig)
  options.root = path.resolve(options.cwd, options.root)
  options.protocol = `http${options.ssl ? 's' : ''}`
  return options
}
