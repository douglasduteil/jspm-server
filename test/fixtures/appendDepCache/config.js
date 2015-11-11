System.config({
  baseURL: "./test/fixtures/transpileFiles",
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "github:*": "../../../jspm_packages/github/*",
    "npm:*": "../../../jspm_packages/npm/*"
  },

  map: {
    "index": "./index"
  }
});
