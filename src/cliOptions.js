//

import chalk from 'chalk'

export default {
  config: {
    config: true,
    describe: chalk.gray('Specify the path to a config file'),
    requiresArg: true
  },
  root: {
    default: '.',
    nargs: 1,
    string: true,
    describe: chalk.gray('Change root')
  },
  port: {
    default: process.env.PORT || 8888,
    nargs: 1,
    string: true,
    describe: chalk.gray('Change port')
  },
  hostname: {
    default: process.env.HOSTNAME || 'localhost',
    nargs: 1,
    string: true,
    describe: chalk.gray('Change hostname')
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
