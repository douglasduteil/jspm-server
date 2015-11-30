'use strict'

module.exports = {
  root: __dirname,
  serverOptions: {
    spdy: {
      plain: true
    }
  },
  system: {
    configFile: __dirname + '/config.js',
    depCache: ['index.js']
  }
}
