#!/usr/bin/env node

var argv = require('yargs')
  .usage('Usage: $0 [options]')
  .options(require('../lib/options.js').default)
  .help('help')
  .version(function () {
    return require('../package').version
  })
  .argv

var chalk = require('chalk')
var JSPMServer = require('../lib').default
var server = JSPMServer(argv)
var app = server.init()
server.start(app, function (err, server, hostname, port) {
  if (err) {
    console.error(chalk.red('Error :'))
    console.error(err)
    return
  }
  console.log(chalk.cyan('Serving "' + argv.root + '" at https://' + hostname + ':' + port))
})
