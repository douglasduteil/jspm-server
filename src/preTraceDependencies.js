//

import Debug from 'debug'

//

const debug = Debug('JSPMServer:preTraceDependencies')

export default preTraceDependencies

//

function preTraceDependencies (builder) {
  var preTraceDependency = PreTracer(builder)
  return function _preTraceDependencies ({depCache = []}) {
    debug('options %j', depCache)
    return Promise.all(depCache.map(preTraceDependency))
  }
}

function PreTracer (builder) {
  var traceExpression = builder.trace.bind(builder)
  var dependenciesTraceCache = builder.__dependenciesTraceCache

  return function preTraceDependency (expression) {
    debug('trace %s', expression)

    // TODO(@douglasduteil): use the cahe plz!
    return Promise.resolve(expression)
      .then(traceExpression)
      .then(Object.keys)
      .then(function removeSelf (depCache) {
        // TODO(@douglasduteil): detect self with normalized expression
        return depCache.filter((dep) => dep !== expression)
      })
      .then(function cacheDepTraceExpression (depCache) {
        debug('cache %s', expression)
        builder.__dependenciesTraceCacheLastModified = new Date()
        dependenciesTraceCache.set(expression, depCache)
      })
  }
}
