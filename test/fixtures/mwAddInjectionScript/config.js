
System.config({
  baseURL: "./test/fixtures/appendDepCache",
  transpiler: "babel",
  paths: {
    'babel': './jspm_packages/npm/babel-core@5.8.33/browser.js',
    'babel-helpers': './jspm_packages/npm/babel-core@5.8.33/external-helpers.js',
    '*': './test/fixtures/appendDepCache/*'
  }
});
