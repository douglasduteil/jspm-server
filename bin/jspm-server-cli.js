#!/usr/bin/env node
'use strict'

var chalk = require('chalk')
var yargs = require('yargs')

var argv = yargs
  .usage(
    '\n' + chalk.bold('Usage:') +
    ' $0 ' + chalk.blue('[options]')
  )
  .options(require('../lib/cliOptions.js').default)
  //
  .detectLocale(false)
  .help('help')
  .version(function () {
    return require('../package').version
  })
  .updateStrings({
    'Show help': chalk.gray('Show help'),
    'Show version number': chalk.gray('Show version number')
  })
  // TODO(douglasduteil): get feedback about wrapping before removing this
  // .wrap(yargs.terminalWidth())
  //
  .argv

var JSPMServer = require('../lib').default
var jspmServer = new JSPMServer(argv)
jspmServer.start()
