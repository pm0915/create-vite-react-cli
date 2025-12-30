import { defineConfig } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import pkg from './package.json' with { type: 'json' }

export default defineConfig({
  input: 'src/index.ts',
  output: {
    file: 'bundle.js',
    format: 'esm',
    banner: `#!/usr/bin/env node\n/*! create-vite-react-cli v${pkg.version} | MIT */`,
  },
  external: ['node:fs', 'node:path', 'node:process'],
  plugins: [
    nodeResolve({ preferBuiltins: true }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    json(),
  ],
})
