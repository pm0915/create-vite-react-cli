import * as path from 'node:path'
import { intro, outro } from '@clack/prompts'
import { helpMessage } from './cli/help'
import { DEFAULT_PROJECT_NAME } from './constants'
import { defaultBanner, gradientBanner } from './utils/cli/banners'
import { collectOptions } from './cli/prompts'
import { scaffoldProject } from './core/scaffold'
import { areFeatureFlagsUsed, parseCliArgs } from './cli/args'
import { detectPackageManager } from './utils/cli/packageManager'
import { buildOutroMessage } from './cli/outro'

import cliPackageJson from '../package.json' with { type: 'json' }

async function run() {
  const cwd = process.cwd()
  const { values: argv, positionals } = parseCliArgs(process.argv.slice(2))

  if (argv.help) {
    console.log(helpMessage)
    process.exit(0)
  }

  if (argv.version) {
    console.log(`${cliPackageJson.name} v${cliPackageJson.version}`)
    process.exit(0)
  }

  // if any of the feature flags is set, we would skip the feature prompts
  const isFeatureFlagsUsed = areFeatureFlagsUsed(argv)

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

  const { features } = result

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
    projectName: result.projectName,
    packageName: result.packageName,
    shouldOverwrite: result.shouldOverwrite,
    features: {
      typescript: needsTypeScript,
      eslint: needsEslint,
      prettier: needsPrettier,
    },
  })

  // Instructions:
  // Supported package managers: pnpm > yarn > bun > npm
  const packageManager = detectPackageManager()

  // TODO README generation
  outro(
    buildOutroMessage({
      cwd,
      root,
      packageManager,
      needsEslint,
      needsPrettier,
    }),
  )
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
