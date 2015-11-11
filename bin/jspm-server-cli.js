#!/usr/bin/env node
'use strict'

var cli = require('../lib/cli').default
var JSPMServer = require('../lib').default

var argv = cli.parse(process.argv)
var jspmServer = new JSPMServer(argv)
jspmServer.start()
