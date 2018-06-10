// imports.
import { get } from 'lodash'
import pkg from './package.json'

// general plugins import.
// node resolve.
const nodeResolve = require('rollup-plugin-node-resolve')()
// commonjs loader.
const commonjs = require('rollup-plugin-commonjs')()
// node globals handler.
const nodeGlobals = require('rollup-plugin-node-globals')()
// json loader.
const json = require('rollup-plugin-json')()
// node builtins transforms.
const nodeBuiltins = require('rollup-plugin-node-builtins')()
// babel plugin.
const babel = require('rollup-plugin-babel')({
  exclude: 'node_modules/**',
  presets: [ [ "env", { modules: false }] ],
  plugins: [ [ "module-resolver", { "root": ["."] } ] ],
  babelrc: false
})
// replace / env plugin.
const replaceEnv = require('rollup-plugin-replace')({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
})

// config for the commonjs bundle.
const commonjsConfig = generateConfig({
  in: 'src/index.js',
  out: 'dist/libby.cjs.js',
  type: 'cjs',
  plugins: [replaceEnv, json, nodeResolve, commonjs, babel, nodeGlobals, nodeBuiltins],
  external: ['lodash', 'commander', 'colors', 'vorpal']
})

// export all bundle configurations (currently only one).
export default [
  commonjsConfig
]
/**
 * Generate configuration for Rollup.
 *
 * @param {{}}     options
 * @return {*}
 */
function generateConfig (options = {}) {
  // start config as an empty object.
  return {
    // main input / entry file.
    input: get(options, 'in'),
    // external libraries.
    external: get(options, 'external', []),
    // bundle output settings.
    output: {
      // target dist file.
      file: get(options, 'out', pkg.main),
      // module name.
      name: get(options, 'module', pkg.name),
      // build format.
      format: get(options, 'type', 'cjs')
    },
    // register plugins.
    plugins: options.plugins || []
  }
}

