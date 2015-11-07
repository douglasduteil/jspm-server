//

const OPTIONS = {
  config: {
    config: true,
    describe: 'Specify the path to a config file'
  },
  root: {
    default: process.cwd(),
    nargs: 1,
    string: true,
    describe: 'Change root'
  },
  port: {
    default: process.env.PORT || 8888,
    nargs: 1,
    string: true,
    describe: 'Change port'
  },
  hostname: {
    default: process.env.HOSTNAME || 'localhost',
    nargs: 1,
    string: true,
    describe: 'Change hostname'
  },
  ssl: {
    boolean: true,
    default: false,
    describe: 'Use SSL connection'
  },
  verbose: {
    boolean: true,
    default: false,
    describe: 'Verbose mode'
  }
}

export default OPTIONS
