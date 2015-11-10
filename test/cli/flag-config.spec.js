//

import test from 'tape'
import {exec} from 'child_process'

import cli from './_cli.js'

//

test('flag: --config', function (t) {
  t.plan(2)
  exec(`${cli} --config './test/fixtures/config-a.js'`, function(err, stdout, stderr) {
    t.equal(stderr, '', 'No stderr')
    t.equal(stdout, ``, 'Should go according the config file options')
    t.end(err)
  })
})
