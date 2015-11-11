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

  var options = {root: '.'}
  var server = http2Server({
    log: logger({ options }),
    options
  })

  t.ok(server, 'server should be defined')
  t.ok(server.listen, 'server should be http.Server like')
  t.end()

  //

  test('http2Server - staticFiles', testStaticFiles)
  test('http2Server - appendDepCache', appendDepCache)
  // test('http2Server - transpileFiles', transpileFiles)
})

//

const expectedTranspileFile =
  fs.readFileSync('./test/fixtures/transpileFiles/expected.js')
  .toString()

const servers = new Map()
const fixtureFolders = fs.readdirSync('./test/fixtures')

Promise.all(fixtureFolders.map(function (fixtureFolder) {
  return before(requireFixtureConfig(fixtureFolder))
    .then((server) => servers.set(fixtureFolder, server))
}))

function before (options) {
  const builder = new InnerBuilder()
  var server = http2Server({
    log: logger({ options }),
    builder,
    options
  })
  return Promise.resolve()
    .then(() => builder.loadConfig.bind(builder, options.root))
    .then(() => server)
}

function appendDepCache (t) {
  // Given
  var server = servers.get('appendDepCache')

  // When
  request(server)
    .get('/index.html')

    // Then
    .expect(200)
    .expect('Content-Type', /html/)
    .expect('Content-Length', '123')
    .end(function (err, rep) {
      t.error(err, 'Expect no error from GET /index.html')
      t.ok(rep.text.match(/<!DOCTYPE html>/), 'Expect the index.html')
      t.end()
    })
}

function transpileFiles (t) {
  // Given
  var server = servers.get('transpileFiles')

  // When
  request(server)
    .get('/index.js')

    // Then
    .expect(200)
    .expect('Content-Type', /javascript/)
    .expect('Content-Length', '113')
    .end(function (err, rep) {
      t.error(err, 'Expect no error from GET /index.js')
      t.equal(rep.text, expectedTranspileFile.slice(0, -1))
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
    .expect('Content-Length', '123')
    .end(function (err, rep) {
      t.error(err, 'Expect no error from GET /')
      t.ok(rep.text.match(/<!DOCTYPE html>/), 'Expect the index.html')
      t.end()
    })
}

