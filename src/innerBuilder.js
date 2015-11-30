//

import Builder from 'systemjs-builder'

//

export default InnerBuilder

//

function InnerBuilder (root, configFile) {
  const builder = new Builder(root, configFile)

  // Builder caches
  builder.__compiledFilesCache = new Map()
  builder.__dependenciesTraceCache = new Map()
  builder.__dependenciesTraceCacheLastModified = new Date()
  builder.__fileCache = new Map()
  builder.__injectionCache = new Map()
  builder.__injectionCacheLastModified = new Date()

  return builder
}
