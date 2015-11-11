'use strict'

module.exports = {
  root: __dirname,
  serverOptions: {
    spdy: {
      plain: true
    }
  },
  system: {
    depCache: ['babel-runtime']
  }
}
