import { fileURLToPath } from 'node:url'
import { language } from './locales'

export const DEFAULT_PROJECT_NAME = 'my-vite-react-app'

export const TEMPLATE_ROOT = fileURLToPath(new URL('../templates', import.meta.url))

export const FEATURE_FLAGS = [
  'default',
  'ts',
  'typescript',
  'eslint',
  'prettier',
  'eslint-with-prettier',
] as const

export const FEATURE_OPTIONS = [
  {
    value: 'typescript',
    label: language.needsTypeScript.message,
  },
  {
    value: 'eslint',
    label: language.needsEslint.message,
  },
  {
    value: 'prettier',
    label: language.needsPrettier.message,
  },
] as const
