//

import Builder from 'systemjs-builder'

//

export default InnerBuilder

//

function InnerBuilder (root, configFile) {
  const builder = new Builder(root, configFile)
  return builder
}
