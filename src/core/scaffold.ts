import * as fs from 'node:fs'
import * as path from 'node:path'
import ejs from 'ejs'

import { language } from '../locales'
import { TEMPLATE_ROOT } from '../constants'
import { emptyDir } from '../utils/fs/directory'
import { preOrderDirectoryTraverse } from '../utils/fs/directoryTraverse'
import renderTemplate from '../utils/fs/renderTemplate'

export interface ScaffoldOptions {
  root: string
  projectName: string
  packageName: string
  shouldOverwrite: boolean
  features: {
    typescript: boolean
    eslint: boolean
    prettier: boolean
  }
}

export async function scaffoldProject({
  root,
  projectName,
  packageName,
  shouldOverwrite,
  features,
}: ScaffoldOptions) {
  if (fs.existsSync(root) && shouldOverwrite) {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }

  console.log(`
${language.infos.scaffolding} ${root}...`)

  const pkg = { name: packageName, version: '0.0.0' }
  fs.writeFileSync(path.resolve(root, 'package.json'), JSON.stringify(pkg, null, 2))

  const callbacks: ((dataStore: Record<string, any>) => Promise<void>)[] = []
  const render = function render(templateName: string) {
    const templateDir = path.resolve(TEMPLATE_ROOT, templateName)
    renderTemplate(templateDir, root, callbacks)
  }

  // Render base template
  render('base')

  // Add configs.
  if (features.typescript) {
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
  if (features.eslint) {
    render('linting/base')

    if (features.typescript) {
      render('linting/core/ts')
    } else {
      render('linting/core/js')
    }

    // These configs only disable rules, so they should be applied last.
    if (features.prettier) {
      render('linting/prettier')
    }
  }

  if (features.prettier) {
    render('formatting/prettier')
  }

  // Render code template.
  const codeTemplate = features.typescript ? 'typescript-' : 'default'

  render(`code/${codeTemplate}`)

  render('entry/default')

  // An external data store for callbacks to share data
  const dataStore: Record<string, any> = {}

  const indexHtmlPath = path.resolve(root, 'index.html')
  dataStore[indexHtmlPath] = {
    title: projectName,
    entryExt: features.typescript ? 'tsx' : 'jsx',
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

  if (features.typescript) {
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
        } else if (filepath.endsWith('.jsx')) {
          const tsxFilePath = filepath.replace(/\.jsx$/, '.tsx')
          if (fs.existsSync(tsxFilePath)) {
            fs.unlinkSync(filepath)
          } else {
            fs.renameSync(filepath, tsxFilePath)
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
    // Remove all the remaining `.ts` and `.tsx` files
    preOrderDirectoryTraverse(
      root,
      () => {},
      (filepath) => {
        if (filepath.endsWith('.ts') || filepath.endsWith('.tsx')) {
          fs.unlinkSync(filepath)
        }
      },
    )
  }
}
