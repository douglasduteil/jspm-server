//

import {assert} from 'chai'
import hideStack from 'hide-stack-frames-from'
import request from 'supertest'
import path from 'path'

import JSPMServer from '../src/index'

hideStack('mocha')

describe('JSPMServer', function () {
  it('should be a function', function () {
    assert.isFunction(JSPMServer)
  })

  describe('#init', function () {
    beforeEach(function () {
      this.server = JSPMServer({
        root: 'foo'
      })
    })

    it('should be exposed', function () {
      assert.isFunction(this.server.init)
    })

    it('should be return a connect app', function () {
      var app = this.server.init()
      assert.isFunction(app)
      assert.isFunction(app.use)
    })
  })

  describe('#start', function () {
    beforeEach(function () {
      this.server = JSPMServer({
        root: 'foo',
        hostname: 'localhost',
        http2: {
          key: path.resolve(__dirname, '../ssl/server.key'),
          cert: path.resolve(__dirname, '../ssl/server.crt'),
          ca: path.resolve(__dirname, '../ssl/ca.crt')
        }
      })
    })

    it('should be exposed', function () {
      assert.isFunction(this.server.start)
    })

    it('should be return a connect app', function (done) {
      var app = this.server.init()
      this.server.start(app, function (err) {
        assert.notOk(err)
        done()
      })
    })
  })
})
