//

export default depCacheScriptTemplate

//

function depCacheScriptTemplate (depCaches) {
  return `
System.config({
  depCache: ${JSON.stringify(depCaches)}
})
  `.trim()
}
