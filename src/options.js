//

import path from 'path'

//

const OPTIONS = {
  root: {
    default: process.cwd()
  },
  port: {
    default: process.env.PORT || 8888
  },
  hostname: {
    default: process.env.HOSTNAME || 'localhost'
  },
  http2: {
    default: {
      key: path.resolve(__dirname, '../ssl/server.key'),
      cert: path.resolve(__dirname, '../ssl/server.crt'),
      ca: path.resolve(__dirname, '../ssl/ca.crt'),
      requestCert: true,
      rejectUnauthorized: false
    }
  },
  verbose: {
    default: false
  }
}

export default OPTIONS
