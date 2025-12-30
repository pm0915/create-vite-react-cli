import * as fs from 'node:fs'
import * as path from 'node:path'
import { confirm, cancel } from '@clack/prompts'
import { red } from 'picocolors'
import { unwrapPrompt } from '../prompts/utils'

const PROJECT_NAME_RE = /^[a-z0-9-]+$/

function resolveProjectName(input?: string, defaultName = 'my-vite-react-app') {
  const name = (input && input.trim()) || defaultName

  if (!PROJECT_NAME_RE.test(name)) {
    throw new Error('项目名称只能包含小写字母、数字和连字符')
  }

  return name
}

async function resolveTargetDir(projectName: string) {
  const dir = path.resolve(process.cwd(), projectName)

  if (fs.existsSync(dir)) {
    const overwrite = await unwrapPrompt(
      confirm({
        message: `目录 "${projectName}" 已存在，是否覆盖?`,
        initialValue: false,
      }),
    )

    if (!overwrite) {
      cancel(red('✖') + ' 操作已取消')
      process.exit(0)
    }

    fs.rmSync(dir, { recursive: true, force: true })
  }

  return dir
}

export { resolveProjectName, resolveTargetDir }
