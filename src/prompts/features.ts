import { multiselect, select } from '@clack/prompts'
import { unwrapPrompt } from './utils'

type Choices = {
  language?: 'js' | 'ts'
  eslint?: boolean
  prettier?: boolean
}

async function resolveChoices(provided: Choices = {}) {
  const choices: Choices = { ...provided }

  if (!choices.language) {
    choices.language = await unwrapPrompt(
      select({
        message: 'Select language:',
        options: [
          { value: 'js', label: 'JavaScript' },
          { value: 'ts', label: 'TypeScript' },
        ],
      }),
    )
  }

  const featureOptions = []

  if (choices.eslint === undefined) {
    featureOptions.push({
      value: 'eslint',
      label: 'ESLint',
      hint: 'ESLint (error prevention)',
    })
  }

  if (choices.prettier === undefined) {
    featureOptions.push({
      value: 'prettier',
      label: 'Prettier',
      hint: 'Prettier (code formatting)',
    })
  }

  if (featureOptions.length > 0) {
    const selected = await unwrapPrompt(
      multiselect({
        message: 'Select features to include in your project:',
        options: featureOptions,
        required: false,
      }),
    )

    if (choices.eslint === undefined) {
      choices.eslint = selected.includes('eslint')
    }
    if (choices.prettier === undefined) {
      choices.prettier = selected.includes('prettier')
    }
  }

  return {
    language: choices.language ?? 'js',
    eslint: choices.eslint ?? false,
    prettier: choices.prettier ?? false,
  }
}

export { resolveChoices }
