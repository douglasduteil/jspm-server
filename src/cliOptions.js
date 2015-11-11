//

import chalk from 'chalk'

export default {
  config: {
    describe: chalk.gray('Specify the path to a config file'),
    nargs: 1,
    requiresArg: true
  },
  root: {
    default: '.',
    nargs: 1,
    string: true,
    describe: chalk.gray('Change root'),
    requiresArg: true
  },
  port: {
    default: process.env.PORT || 8888,
    nargs: 1,
    string: true,
    describe: chalk.gray('Change port'),
    requiresArg: true
  },
  hostname: {
    default: process.env.HOSTNAME || 'localhost',
    nargs: 1,
    string: true,
    describe: chalk.gray('Change hostname'),
    requiresArg: true
  },
  ssl: {
    boolean: true,
    default: false,
    describe: chalk.gray('Use SSL connection')
  },
  verbose: {
    boolean: true,
    default: false,
    describe: chalk.gray('Set erbose mode')
  }
}
