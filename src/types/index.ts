import { language } from '../locales/inedex'

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

export type PromptResult = {
  projectName?: string
  shouldOverwrite?: boolean
  packageName?: string
  features?: (typeof FEATURE_OPTIONS)[number]['value'][]
}

export interface EjsFile {
  src: string
  dest: string
  key: string
}
