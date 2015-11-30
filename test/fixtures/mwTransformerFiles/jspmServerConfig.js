'use strict'

module.exports = {
  root: __dirname,
  serverOptions: {
    spdy: {
      plain: true
    }
  },
  transformer: {
    files: {
      // https://www.npmjs.com/package/micromatch#matcher
      pattern: '*.js'
    }
  },
  system: {
    configFiles: [__dirname + './config.js']
  }
}
