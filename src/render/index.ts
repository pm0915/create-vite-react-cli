import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import { renderTemplate } from './renderTemplate'
import { processEjsFiles } from './processEjs'

function writeJsonSync(file: string, data: unknown) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

function processProjectFiles(result) {
  const { targetDir, projectName, needsTypeScript, eslint, prettier } = result

  /* ---------- package.json ---------- */
  writeJsonSync(path.join(targetDir, 'package.json'), {
    name: projectName,
    version: '0.0.0',
  })

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  console.log('__filename:', __filename)
  console.log('__dirname:', __dirname)
  const templateRoot = path.join(__dirname, './templates')
  console.log('templateRoot:', templateRoot)

  const ejsFiles: {
    src: string
    dest: string
    key: string
  }[] = []

  const render = (name: string) => {
    renderTemplate(path.join(templateRoot, name), targetDir, [], ejsFiles)
  }

  /* ---------- base ---------- */
  render('base')

  /* ---------- TypeScript ---------- */
  if (needsTypeScript) {
    render('config/typescript')
    render('tsconfig/base')

    const jsConfig = path.join(targetDir, 'vite.config.js')
    if (fs.existsSync(jsConfig)) {
      fs.rmSync(jsConfig)
    }
  }

  /* ---------- ESLint ---------- */
  if (eslint) {
    render('linting/base')
    render(needsTypeScript ? 'linting/core/ts' : 'linting/core/js')
  }

  /* ---------- Prettier ---------- */
  if (prettier) {
    render('formatting/prettier')
  }

  /* ---------- Code ---------- */
  render(`code/${needsTypeScript ? 'typescript-default' : 'default'}`)
  render(`entry/${needsTypeScript ? 'typescript' : 'default'}`)

  /* ---------- EJS ---------- */
  processEjsFiles(ejsFiles, {
    default: {
      entryExt: needsTypeScript ? 'tsx' : 'jsx',
      title: projectName,
    },
  })
}

export { processProjectFiles }
