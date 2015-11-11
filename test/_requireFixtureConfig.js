//

export default requireFixtureConfig

//

function requireFixtureConfig (fixtureName) {
  return require(`./fixtures/${fixtureName}/jspmServerConfig.js`)
}
