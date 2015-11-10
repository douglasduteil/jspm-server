//

import test from 'tape'
import {exec} from 'child_process'

import pkg from '../../package.json'
import cli from './_cli.js'

//

test('flag: --version', function (t) {
  t.plan(2)
  exec(`${cli} --version`, function (err, stdout, stderr) {
    t.equal(stderr, '', 'No stderr')
    t.equal(stdout, `${pkg.version}\n`, 'Display the current package version')
    t.end(err)
  })
})
