#!/usr/bin/env node
'use strict'

var debug = require('debug')('JSPMServer:cli')
var cli = require('../lib/cli').default
var JSPMServer = require('../lib').default

var argv = cli.parse(process.argv)
debug('argv %j', argv)
var jspmServer = new JSPMServer(argv)
jspmServer.start()
