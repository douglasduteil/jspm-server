//

import chalk from 'chalk'
import getLogger from 'glogg'
import fancyLog from 'fancy-log'

//

const LEVELS = [
  'error',
  'warn',
  'info',
  'debug'
]

export default function logger ({verbose}) {
  var log = getLogger(chalk.blue('[*]'))

  // TODO(douglasduteil): handle not verbose mode here

  LEVELS
    .forEach(function (level) {
      if (level === 'error') {
        log.on(level, fancyLog.error)
      } else {
        log.on(level, fancyLog)
      }
    })

  return log
}
