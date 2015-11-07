'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-polyfill');

var _connect = require('connect');

var _connect2 = _interopRequireDefault(_connect);

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

var _lodash = require('lodash.ary');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//

//

exports.default = server;

//

function server() {
  for (var _len = arguments.length, options = Array(_len), _key = 0; _key < _len; _key++) {
    options[_key] = arguments[_key];
  }

  var userOptions = options.reduce((0, _lodash2.default)(Object.assign), {});
  return { start: start, init: init, options: userOptions };

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

    var options = {
      spdy: {
        plain: !userOptions.ssl
      }
    };

    if (userOptions.ssl) {
      options = userOptions.ssl;
    }

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