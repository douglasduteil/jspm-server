//

import portScanner from 'portscanner'

//

export default resolvePortNumberAsync

//

function resolvePortNumberAsync ({hostname, port}) {
  return new Promise(function portscannAsync (resolve, reject) {
    portScanner.findAPortNotInUse(
      port,
      null,
      hostname,
      function portscannerCallback (err, port) {
        return err ? reject(err) : resolve(port)
      })
  })
}
