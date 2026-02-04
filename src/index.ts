import * as path from 'node:path'
import { parseArgs } from 'node:util'
import { intro, outro } from '@clack/prompts'
import { green, bold, dim } from 'picocolors'
import { language } from './locales'
import { helpMessage } from './cli/help'
import { DEFAULT_PROJECT_NAME, FEATURE_FLAGS } from './constants'
import { defaultBanner, gradientBanner } from './utils/cli/banners'
import getCommand from './utils/cli/getCommand'
import { dotGitDirectoryState } from './utils/fs/directoryTraverse'
import { collectOptions } from './cli/prompts'
import { scaffoldProject } from './core/scaffold'

import cliPackageJson from '../package.json' with { type: 'json' }

async function createProject() {
  const cwd = process.cwd()
  const args = process.argv.slice(2)

  const flags = [...FEATURE_FLAGS, 'force', 'help', 'version'] as const
  type CLIOptions = {
    [key in (typeof flags)[number]]: { readonly type: 'boolean' }
  }
  const options = Object.fromEntries(flags.map((key) => [key, { type: 'boolean' }])) as CLIOptions

  const { values: argv, positionals } = parseArgs({
    args,
    options,
    strict: true,
    allowPositionals: true,
  })

  if (argv.help) {
    console.log(helpMessage)
    process.exit(0)
  }

  if (argv.version) {
    console.log(`${cliPackageJson.name} v${cliPackageJson.version}`)
    process.exit(0)
  }

  // if any of the feature flags is set, we would skip the feature prompts
  const isFeatureFlagsUsed = FEATURE_FLAGS.some((flag) => typeof argv[flag] === 'boolean')

  const initialTargetDir = positionals[0]
  const defaultProjectName = initialTargetDir || DEFAULT_PROJECT_NAME

  const forceOverwrite = argv.force

  intro(process.stdout.isTTY && process.stdout.getColorDepth() > 8 ? gradientBanner : defaultBanner)

  const { targetDir, result } = await collectOptions(
    initialTargetDir,
    defaultProjectName,
    !!forceOverwrite,
    isFeatureFlagsUsed,
  )

  const { features = [] } = result

  const needsTypeScript = !!(argv.ts || argv.typescript || features.includes('typescript'))
  const needsEslint = !!(argv.eslint || argv['eslint-with-prettier'] || features.includes('eslint'))
  const needsPrettier = !!(
    argv.prettier ||
    argv['eslint-with-prettier'] ||
    features.includes('prettier')
  )

  const root = path.join(cwd, targetDir)

  await scaffoldProject({
    root,
    projectName: result.projectName!,
    packageName: result.packageName!,
    shouldOverwrite: !!result.shouldOverwrite,
    features: {
      typescript: needsTypeScript,
      eslint: needsEslint,
      prettier: needsPrettier,
    },
  })

  // Instructions:
  // Supported package managers: pnpm > yarn > bun > npm
  const userAgent = process.env.npm_config_user_agent ?? ''
  const packageManager = /pnpm/.test(userAgent)
    ? 'pnpm'
    : /yarn/.test(userAgent)
      ? 'yarn'
      : /bun/.test(userAgent)
        ? 'bun'
        : 'npm'

  // TODO README generation

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

  outro(outroMessage)
}

createProject().catch((error) => {
  console.error(error)
  process.exit(1)
})
