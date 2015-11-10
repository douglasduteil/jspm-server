//
/*
return

import test from 'tape'
import request from 'supertest'
import path from 'path'
import {exec} from 'child_process'

import pkg from '../package.json'
import JSPMServer from '../src/index'

//
var cli = path.resolve(pkg.bin['jspm-server'])

test('CLI: display version')
describe('CLI run options', function () {

  it('should display the version', function () {
    exec(`node ${cli}`, function (err, stdout, stderr) {
      expect(stdout).to.contain('Starting \'errorFunction\'');
      expect(stderr).to.contain('\'errorFunction\' errored after');
      stdout = stdout.replace(/\\/g, '/').split('\n');
      expect(stdout[4]).to.contain('Starting \'anon\'');
      expect(stdout[5]).to.contain('Finished \'anon\'');
      done();
    })
  })
})

*/
