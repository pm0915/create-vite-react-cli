import { text } from '@clack/prompts'
import { unwrapPrompt } from './utils'
const DEFAULT_PROJECT_NAME = 'my-vite-react-app'

async function promptProjectName() {
  const result = await unwrapPrompt(
    text({
      message: '项目名称:',
      placeholder: DEFAULT_PROJECT_NAME,
      defaultValue: DEFAULT_PROJECT_NAME,
      validate: (value) => {
        if (!value) return '项目名称不能为空'
        if (!/^[a-z0-9-]+$/.test(value.trim())) {
          return '项目名称只能包含小写字母、数字和连字符'
        }
        return undefined // 表示合法
      },
    }),
  )

  return result === true ? undefined : result
}

export { promptProjectName, DEFAULT_PROJECT_NAME }
