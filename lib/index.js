'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; //

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-polyfill');

var _connect = require('connect');

var _connect2 = _interopRequireDefault(_connect);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _portscanner = require('portscanner');

var _portscanner2 = _interopRequireDefault(_portscanner);

var _send = require('send');

var _send2 = _interopRequireDefault(_send);

var _spdy = require('spdy');

var _spdy2 = _interopRequireDefault(_spdy);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//

exports.default = server;

//

function server(userOptions) {
  return { start: start, init: init };

  function init() {
    var app = (0, _connect2.default)();

    if (userOptions.verbose) {
      app.use((0, _morgan2.default)('dev'));
    }

    app.use(staticServer(userOptions.root));

    return app;
  }

  function start(app, callback) {
    callback = callback || function () {};
    var options = _extends({}, userOptions.http2, {
      ca: _fs2.default.readFileSync(userOptions.http2.ca),
      cert: _fs2.default.readFileSync(userOptions.http2.cert),
      key: _fs2.default.readFileSync(userOptions.http2.key)
    });

    _portscanner2.default.findAPortNotInUse(userOptions.port, userOptions.port + 1000, userOptions.hostname, portFound);

    function portFound(error, port) {
      if (error) {
        console.error(error);
        return callback(error);
      }

      var server = _spdy2.default.createServer(options, app);
      server.listen(port, userOptions.hostname, function (request, response) {
        callback(null, server, userOptions.hostname, port);
      });
    }
  }
}

function staticServer(root) {
  var SUPPORTED_METHODS = ['GET', 'HEAD'];
  return function staticRequest(req, res, next) {
    if (!SUPPORTED_METHODS.includes(req.method)) {
      return next();
    }

    var reqpath = _url2.default.parse(req.url).pathname;

    (0, _send2.default)(req, reqpath, { root: root })
    // .on('error', error)
    // .on('directory', directory)
    // .on('file', file)
    // .on('stream', inject)
    .pipe(res);
  };
}