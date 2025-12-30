import { text } from '@clack/prompts'
import { unwrapPrompt } from './utils'
const DEFAULT_PROJECT_NAME = 'my-vite-react-app'

async function promptProjectName() {
  const result = await unwrapPrompt(
    text({
      message: 'Project name (target directory):',
      placeholder: DEFAULT_PROJECT_NAME,
      defaultValue: DEFAULT_PROJECT_NAME,
      validate: (value) => {
        return value.length === 0 || value.trim().length > 0 ? undefined : 'Should not be empty'
      },
    }),
  )

  return result === true ? undefined : result
}

export { promptProjectName, DEFAULT_PROJECT_NAME }
