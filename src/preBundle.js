//

import _ary from 'lodash.ary'
import Debug from 'debug'

//

const debug = Debug('JSPMServer:preBundle')

export default preBundleAllBundles

//

function preBundleAllBundles (builder) {
  var preBundler = PreBundler(builder)
  return function _preBundleAllBundles ({bundles = []}) {
    debug('options %j', bundles)
    return Promise.all(bundles.map(preBundler))
  }
}

function PreBundler (builder) {
  var traceExpression = builder.trace.bind(builder)
  var inMemoryBundleExpression = _ary(builder.bundle.bind(builder), 1)

  return function preBundleExpression (expression) {
    debug('bundling %j', expression)
    return Promise.resolve(expression)
      .then(traceExpression)
      .then(inMemoryBundleExpression)
      .then(function cacheBundledExpression (output) {
        // TODO(@douglasduteil): use a hash here
        var generateFileName = `==${expression.replace(/[\W]+/g, '-')}==bundle.js`

        builder.__injectionCacheLastModified = new Date()

        return Promise.all([
          cacheBundleFile(builder.__fileCache, generateFileName, output.source),
          cacheInjectionTrace(builder.__injectionCache, generateFileName, output.modules)
        ])
      })
  }
}

function cacheBundleFile (cache, expression, source) {
  debug('cacheBundleFile %s', expression)
  cache.set(expression, source)
}

function cacheInjectionTrace (cache, expression, modules) {
  debug('cacheInjectionTrace %s', expression)
  // debug('cacheInjectionTrace %s: %j', expression, modules)
  cache.set(expression, modules)
}
