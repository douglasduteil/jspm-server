//

import ary from 'lodash.ary'
import path from 'path'

//

export default parseOptions

//

function parseOptions (...optionsArr) {
  const options = optionsArr.reduce(ary(Object.assign), {
    cwd: process.cwd()
  })

  options.root = path.resolve(options.cwd, options.root)
  options.protocol = `http${options.ssl ? 's' : ''}`

  return options
}
