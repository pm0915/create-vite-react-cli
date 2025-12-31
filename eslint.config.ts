import globals from 'globals'
import tseslint from 'typescript-eslint'
import nodePlugin from 'eslint-plugin-n'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: ['dist', 'bundle.js', 'templates/**'],
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    plugins: {
      n: nodePlugin,
    },
    languageOptions: {
      globals: globals.node,
    },
  },
  eslintPluginPrettierRecommended,
])
