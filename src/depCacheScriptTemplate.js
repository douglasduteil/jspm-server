//

export default depCacheScriptTemplate

//

function depCacheScriptTemplate (configObject) {
  return `
"use strict"

System.config(${JSON.stringify(configObject, null, '  ')})
  `.trim() + '\n'
}
