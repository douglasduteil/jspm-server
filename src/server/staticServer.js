//

import send from 'send'
import url from 'url'
import System from 'systemjs'

//

export default function staticServer ({root}) {
  const SUPPORTED_METHODS = ['GET', 'HEAD']
  return function staticRequest (req, res, next) {
    if (!SUPPORTED_METHODS.includes(req.method)) {
      return next()
    }

    const reqpath = url.parse(req.url).pathname

    send(req, reqpath, { root: root })
    // .on('error', error)
    // .on('directory', directory)
    // .on('file', file)
    // .on('stream', inject)
      .pipe(res)
  }
}
