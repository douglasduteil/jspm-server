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

  it('should allow mutliple options', function () {
    var server = JSPMServer({}, {foo: 'bar'}, {qux: 'met'})
    assert.deepEqual(server.options, {foo: 'bar', qux: 'met'})
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
        hostname: 'localhost'
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
