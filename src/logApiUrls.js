//

import chalk from 'chalk'

//

export default logApiUrls

//

function logApiUrls (log, {hostname, port, protocol}) {
  log.info(chalk.bold('Access URLs'))

  // TODO(douglasduteil): list IP too
  log.info(chalk.gray(`${protocol}://${hostname}:${port}`))
}
