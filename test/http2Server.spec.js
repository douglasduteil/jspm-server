//

import fs from 'fs'
import test from 'tape'
import request from 'supertest'

import requireFixtureConfig from './_requireFixtureConfig'

import http2Server from '../src/http2Server'
import logger from '../src/logger'
import InnerBuilder from '../src/innerBuilder'

//

test('http2Server', function (t) {
  t.equal(typeof http2Server, 'function', 'http2Server should to be a function')

  var options = { root: '.' }
  var server = http2Server({
    log: logger({ options }),
    options
  })

  t.ok(server, 'server should be defined')
  t.ok(server.listen, 'server should be http.Server like')
  t.end()

  //

  test('http2Server - staticFiles', testStaticFiles)
  test('http2Server - mwAddInjectionScript', mwAddInjectionScript)
  test('http2Server - mwServeInjectionScript', mwServeInjectionScript)
  test('http2Server - mwTransformerFiles', mwTransformerFiles)
})

//

const expectedTranspileFile =
  fs.readFileSync('./test/fixtures/mwTransformerFiles/expected.js')
    .toString()

const expectedHtmlFile =
  fs.readFileSync('./test/fixtures/mwAddInjectionScript/expected.html')
    .toString()

const expectedInjectionScriptFile =
  fs.readFileSync('./test/fixtures/mwServeInjectionScript/expected.js')
    .toString()

const servers = new Map()
const fixtureFolders = fs.readdirSync('./test/fixtures')

Promise.all(fixtureFolders.map(function (fixtureFolder) {
  return before(requireFixtureConfig(fixtureFolder))
    .then((server) => servers.set(fixtureFolder, server))
}))

function before (options = {}) {
  var jspmServer = {
    log: logger({ options }),
    options
  }

  jspmServer.builder = options.system && new InnerBuilder(options.root, options.system.configFile)

  var server = http2Server(jspmServer)

  return Promise.resolve(server)
}

function mwServeInjectionScript (t) {
  // Given
  var server = servers.get('mwServeInjectionScript')

  // When
  request(server)
    .get('/__jspm__.js')

    // Then
    .expect(200)
    .expect('Content-Type', /javascript/)
    // TODO(@douglasduteil): uniform cache time
    .expect('Cache-Control', 'public, max-age=31536000')
    // TODO(@douglasduteil): cache timers
    .expect('Last-Modified', /GMT/)
    .expect('ETag', '"43-LKACtGP3WzbSr+a4qDcsog"')
    .end(function (err, rep) {
      t.error(err, 'Expect no error from GET /__jspm__.js')
      t.equal(
        rep.text,
        expectedInjectionScriptFile,
        'Expect the __jspm__.js to contain a `System.config(...)')
      t.end()
    })
}

function mwAddInjectionScript (t) {
  // Given
  var server = servers.get('mwAddInjectionScript')

  // When
  request(server)
    .get('/index.html')

    // Then
    .expect(200)
    .expect('X-Hijacked', 'yes!')
    .expect('Content-Type', /html/)
    .end(function (err, rep) {
      t.error(err, 'Expect no error from GET /index.html')
      t.equal(
        rep.text, expectedHtmlFile,
        'Expect the index.html to contain a `<script src="__jspm__.js"></script>')
      t.end()
    })
}

function mwTransformerFiles (t) {
  // Given
  var server = servers.get('mwTransformerFiles')

  // When
  request(server)
    .get('/index.js')

    // Then
    .expect(200)
    .expect('X-Hijacked', 'yes!')
    .expect('Content-Type', /javascript/)
    .end(function (err, rep) {
      t.error(err, 'Expect no error from GET /index.js')
      t.equal(rep.text, expectedTranspileFile, 'Expect transpiled code')
      t.end()
    })
}

function testStaticFiles (t) {
  // Given
  var server = servers.get('staticFiles')

  // When
  request(server)
    .get('/')

    // Then
    .expect(200)
    .expect('Content-Type', /html/)
    .end(function (err, rep) {
      t.error(err, 'Expect no error from GET /')
      t.ok(rep.text.match(/<!DOCTYPE html>/), 'Expect the index.html')
      t.end()
    })
}

