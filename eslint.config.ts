import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  // ----------------- JS / TS 基础 -----------------
  {
    files: ['src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
  },

  // ----------------- TypeScript -----------------
  {
    files: ['src/**/*.{ts,tsx,cts,mts}'],
    ...tseslint.configs.recommended,
  },

  // ----------------- Prettier -----------------
  eslintPluginPrettierRecommended,
])
