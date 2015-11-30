//

import chalk from 'chalk'
import yargs from 'yargs'

//

export default yargs
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
