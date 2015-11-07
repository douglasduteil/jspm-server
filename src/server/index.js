//

import proxyServer from './proxyServer'
import staticServer from './staticServer'

//

const STRATEGIES = {
  PROXY: proxyServer,
  STATIC: staticServer
}

export function staticStrategy (options) {
  var strategy = STRATEGIES.STATIC

  if (options.proxy) {
    strategy = STRATEGIES.PROXY
  }

  return strategy(options)
}
