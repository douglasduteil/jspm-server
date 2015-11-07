#!/usr/bin/env node
'use strict'

var argv = require('yargs')
  .usage('Usage: $0 [options]')
  .options(require('../lib/options.js').default)
  //
  .detectLocale(false)
  .help('help')
  .version(function () {
    return require('../package').version
  })
  .wrap(null)
  //
  .argv

// Delayed inport for faster boot
var chalk = require('chalk')
var path = require('path')
var assign = require('lodash.assign')
var JSPMServer = require('../lib').default
var config = require('./default.config.js')

if (argv.config) {
  assign(argv, require(path.resolve(process.cwd(), argv.config)))
}

if (argv.ssl) {
  argv.ssl = config.ssl
}

var server = JSPMServer(config, argv)
var app = server.init()

server.start(app, function (err, server, hostname, port) {
  if (err) {
    console.error(chalk.red('Error :'))
    console.error(err)
    return
  }
  var url = 'http' + (argv.ssl ? 's' : '') + '://' + hostname + ':' + port
  console.log(chalk.cyan('Serving "' + argv.root + '" at ' + url))
})
