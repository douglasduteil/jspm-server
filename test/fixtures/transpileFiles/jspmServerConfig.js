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
    },
    configFiles: ['./config.js']
  }
}
