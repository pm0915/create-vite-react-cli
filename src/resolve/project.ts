import * as fs from 'node:fs'
import * as path from 'node:path'
import { confirm, cancel } from '@clack/prompts'
import { red } from 'picocolors'
import { unwrapPrompt } from '../prompts/utils'

const PROJECT_NAME_RE = /^[a-z0-9-]+$/

function resolveProjectName(input?: string, defaultName = 'my-vite-react-app') {
  const name = (input && input.trim()) || defaultName

  if (!PROJECT_NAME_RE.test(name)) {
    throw new Error('The project name can only contain lowercase letters, numbers, and hyphens.')
  }

  return name
}

async function resolveTargetDir(projectName: string) {
  const dir = path.resolve(process.cwd(), projectName)

  if (fs.existsSync(dir)) {
    const overwrite = await unwrapPrompt(
      confirm({
        message: `Directory "${projectName}" already exists, overwrite?`,
        initialValue: false,
      }),
    )

    if (!overwrite) {
      cancel(red('✖') + ' Operation cancelled')
      process.exit(0)
    }

    fs.rmSync(dir, { recursive: true, force: true })
  }

  return dir
}

export { resolveProjectName, resolveTargetDir }
