'use strict'

module.exports = {
  root: __dirname,
  serverOptions: {
    spdy: {
      plain: true
    }
  },
  system: {
    configFile: './test/fixtures/appendDepCache/config.js',
    depCache: ['index.js']
  }
}
