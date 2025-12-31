import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import ejs from 'ejs'
import { intro, text, confirm, multiselect, outro, cancel } from '@clack/prompts'
import { red, green, bold, dim } from 'picocolors'

import { language } from './locales/index'
import { helpMessage } from './help/index'
import { FEATURE_FLAGS, FEATURE_OPTIONS, PromptResult } from './types/index'

import { unwrapPrompt } from './utils/prompt'
import { defaultBanner, gradientBanner } from './utils/banners'
import getCommand from './utils/getCommand'
import { isValidPackageName, toValidPackageName } from './utils/package'
import { canSkipEmptying, emptyDir } from './utils/directory'
import { preOrderDirectoryTraverse, dotGitDirectoryState } from './utils/directoryTraverse'
import renderTemplate from './utils/renderTemplate'

import cliPackageJson from '../package.json' with { type: 'json' }

const DEFAULT_PROJECT_NAME = 'my-vite-react-app'

async function createProject() {
  const cwd = process.cwd()
  const args = process.argv.slice(2)

  const flags = [...FEATURE_FLAGS, 'force', 'bare', 'help', 'version'] as const
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

  let targetDir = positionals[0]
  const defaultProjectName = targetDir || DEFAULT_PROJECT_NAME

  const forceOverwrite = argv.force

  const result: PromptResult = {
    projectName: defaultProjectName,
    shouldOverwrite: forceOverwrite,
    packageName: defaultProjectName,
    features: [],
  }

  intro(process.stdout.isTTY && process.stdout.getColorDepth() > 8 ? gradientBanner : defaultBanner)

  if (!targetDir) {
    const _result = await unwrapPrompt(
      text({
        message: language.projectName.message,
        placeholder: defaultProjectName,
        defaultValue: defaultProjectName,
        validate: (value) =>
          value.length === 0 || value.trim().length > 0
            ? undefined
            : language.projectName.invalidMessage,
      }),
    )
    targetDir = result.projectName = result.packageName = _result.trim()
  }

  if (!canSkipEmptying(targetDir) && !forceOverwrite) {
    result.shouldOverwrite = await unwrapPrompt(
      confirm({
        message: `${
          targetDir === '.'
            ? language.shouldOverwrite.dirForPrompts.current
            : `${language.shouldOverwrite.dirForPrompts.target} "${targetDir}"`
        } ${language.shouldOverwrite.message}`,
        initialValue: false,
      }),
    )

    if (!result.shouldOverwrite) {
      cancel(red('✖') + ` ${language.errors.operationCancelled}`)
      process.exit(0)
    }
  }

  if (!isValidPackageName(targetDir)) {
    result.packageName = await unwrapPrompt(
      text({
        message: language.packageName.message,
        initialValue: toValidPackageName(targetDir),
        validate: (value) =>
          isValidPackageName(value) ? undefined : language.packageName.invalidMessage,
      }),
    )
  }

  if (!isFeatureFlagsUsed) {
    result.features = await unwrapPrompt(
      multiselect({
        message: `${language.featureSelection.message} ${dim(language.featureSelection.hint)}`,
        // @ts-expect-error @clack/prompt's type doesn't support readonly array yet
        options: FEATURE_OPTIONS,
        required: false,
      }),
    )
  }

  const { features } = result

  const needsTypeScript = argv.ts || argv.typescript || features.includes('typescript')
  const needsEslint = argv.eslint || argv['eslint-with-prettier'] || features.includes('eslint')
  const needsPrettier =
    argv.prettier || argv['eslint-with-prettier'] || features.includes('prettier')

  const root = path.join(cwd, targetDir)

  if (fs.existsSync(root) && result.shouldOverwrite) {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }

  console.log(`\n${language.infos.scaffolding} ${root}...`)

  const pkg = { name: result.packageName, version: '0.0.0' }
  fs.writeFileSync(path.resolve(root, 'package.json'), JSON.stringify(pkg, null, 2))

  const templateRoot = fileURLToPath(new URL('./templates', import.meta.url))
  const callbacks = []
  const render = function render(templateName) {
    const templateDir = path.resolve(templateRoot, templateName)
    renderTemplate(templateDir, root, callbacks)
  }

  // Render base template
  render('base')

  // Add configs.
  if (needsTypeScript) {
    render('config/typescript')

    // Render tsconfigs
    render('tsconfig/base')
    // The content of the root `tsconfig.json` is a bit complicated,
    // So here we are programmatically generating it.
    const rootTsConfig = {
      // It doesn't target any specific files because they are all configured in the referenced ones.
      files: [],
      // All templates contain at least a `.node` and a `.app` tsconfig.
      references: [
        {
          path: './tsconfig.node.json',
        },
        {
          path: './tsconfig.app.json',
        },
      ],
    }

    fs.writeFileSync(
      path.resolve(root, 'tsconfig.json'),
      JSON.stringify(rootTsConfig, null, 2) + '\n',
      'utf-8',
    )
  }

  // Render ESLint config
  if (needsEslint) {
    render('linting/base')

    if (needsTypeScript) {
      render('linting/core/ts')
    } else {
      render('linting/core/js')
    }

    // These configs only disable rules, so they should be applied last.
    if (needsPrettier) {
      render('linting/prettier')
    }
  }

  if (needsPrettier) {
    render('formatting/prettier')
  }

  // Render code template.
  const codeTemplate = needsTypeScript ? 'typescript-' : ''

  render(`code/${codeTemplate}`)

  render('entry/default')

  // An external data store for callbacks to share data
  const dataStore = {}

  const indexHtmlPath = path.resolve(root, 'index.html')
  dataStore[indexHtmlPath] = {
    title: result.projectName,
    entryExt: needsTypeScript ? 'tsx' : 'jsx',
  }

  // Process callbacks
  for (const cb of callbacks) {
    await cb(dataStore)
  }

  // EJS template rendering
  preOrderDirectoryTraverse(
    root,
    () => {},
    (filepath) => {
      if (filepath.endsWith('.ejs')) {
        const template = fs.readFileSync(filepath, 'utf-8')
        const dest = filepath.replace(/\.ejs$/, '')
        const content = ejs.render(template, dataStore[dest])

        fs.writeFileSync(dest, content)
        fs.unlinkSync(filepath)
      }
    },
  )

  if (needsTypeScript) {
    preOrderDirectoryTraverse(
      root,
      () => {},
      (filepath) => {
        if (filepath.endsWith('.js')) {
          const tsFilePath = filepath.replace(/\.js$/, '.ts')
          if (fs.existsSync(tsFilePath)) {
            fs.unlinkSync(filepath)
          } else {
            fs.renameSync(filepath, tsFilePath)
          }
        } else if (path.basename(filepath) === 'jsconfig.json') {
          fs.unlinkSync(filepath)
        }
      },
    )

    // Rename entry in `index.html`
    const indexHtmlPath = path.resolve(root, 'index.html')
    const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8')
    fs.writeFileSync(indexHtmlPath, indexHtmlContent.replace('src/main.js', 'src/main.ts'))
  } else {
    // Remove all the remaining `.ts` files
    preOrderDirectoryTraverse(
      root,
      () => {},
      (filepath) => {
        if (filepath.endsWith('.ts')) {
          fs.unlinkSync(filepath)
        }
      },
    )
  }

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
