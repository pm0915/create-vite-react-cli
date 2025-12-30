import path from 'node:path'
import { outro } from '@clack/prompts'
import { green, bold } from 'picocolors'

function printNextSteps(result) {
  const { targetDir, prettier } = result
  const cdPath = path.relative(process.cwd(), targetDir)

  let message = `${green('✓')} 项目创建成功!\n\n`
  message += `   ${bold(green(`cd ${cdPath.includes(' ') ? `"${cdPath}"` : cdPath}`))}\n`
  message += `   ${bold(green('npm install'))}\n`

  if (prettier) {
    message += `   ${bold(green('npm run format'))}\n`
  }

  message += `   ${bold(green('npm run dev'))}\n`

  outro(message)
}

export { printNextSteps }
