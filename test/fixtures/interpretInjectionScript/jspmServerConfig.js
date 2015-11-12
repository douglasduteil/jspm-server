'use strict'

module.exports = {
  root: __dirname,
  serverOptions: {
    spdy: {
      plain: true
    }
  },
  system: {
    configFile: './test/fixtures/interpretInjectionScript/config.js',
    depCache: ['index.js']
  }
}
