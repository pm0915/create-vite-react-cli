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
        message: '选择语言:',
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
      hint: '添加 ESLint 代码检查',
    })
  }

  if (choices.prettier === undefined) {
    featureOptions.push({
      value: 'prettier',
      label: 'Prettier',
      hint: '添加 Prettier 代码格式化',
    })
  }

  if (featureOptions.length > 0) {
    const selected = await unwrapPrompt(
      multiselect({
        message: '选择功能:',
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
