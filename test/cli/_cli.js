//

import path from 'path'
import pkg from '../../package.json'

//

export default `node ${path.resolve(pkg.bin['jspm-server'])}`
