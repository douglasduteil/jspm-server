//

import test from 'tape'
import {exec} from 'child_process'

import pkg from '../../package.json'
import path from 'path'

//

var CLI_PATH = `node ${path.resolve(pkg.bin['jspm-server'])}`

test('flag: --version', function (t) {
  t.plan(2)
  exec(`${CLI_PATH} --version`, function (err, stdout, stderr) {
    t.equal(stderr, '', 'No stderr')
    t.equal(stdout, `${pkg.version}\n`, 'Display the current package version')
    t.end(err)
  })
})
