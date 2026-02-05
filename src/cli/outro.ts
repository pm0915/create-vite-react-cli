import * as path from 'node:path'
import { bold, dim, green } from 'picocolors'
import { language } from '../locales'
import getCommand from '../utils/cli/getCommand'
import { dotGitDirectoryState } from '../utils/fs/directoryTraverse'
import type { PackageManager } from '../utils/cli/packageManager'

type OutroOptions = {
  cwd: string
  root: string
  packageManager: PackageManager
  needsEslint: boolean
  needsPrettier: boolean
}

export function buildOutroMessage({
  cwd,
  root,
  packageManager,
  needsEslint,
  needsPrettier,
}: OutroOptions) {
  let outroMessage = `${language.infos.done}\n\n`

  if (root !== cwd) {
    const cdProjectName = path.relative(cwd, root)
    outroMessage += `   ${bold(green(`cd ${cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName}`))}\n`
  }

  outroMessage += `   ${bold(green(getCommand(packageManager, 'install')))}\n`
  if (needsEslint) {
    outroMessage += `   ${bold(green(getCommand(packageManager, 'lint')))}\n`
  }
  if (needsPrettier) {
    outroMessage += `   ${bold(green(getCommand(packageManager, 'format')))}\n`
  }
  outroMessage += `   ${bold(green(getCommand(packageManager, 'dev')))}\n`

  if (!dotGitDirectoryState.hasDotGitDirectory) {
    outroMessage += `
${dim('|')} ${language.infos.optionalGitCommand}

   ${bold(green('git init && git add -A && git commit -m "initial commit"'))}`
  }

  return outroMessage
}
