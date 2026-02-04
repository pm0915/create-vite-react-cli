import { FEATURE_OPTIONS } from '../constants'

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
