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

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const templateRoot = path.join(__dirname, './templates')

  const ejsFiles: {
    src: string
    dest: string
    key: string
  }[] = []

  const render = (name: string) => {
    renderTemplate(path.join(templateRoot, name), targetDir, ejsFiles)
  }

  /* ---------- base ---------- */
  render('base')

  /* ---------- Update package.json name ---------- */
  const packageJsonPath = path.join(targetDir, 'package.json')
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    packageJson.name = projectName
    writeJsonSync(packageJsonPath, packageJson)
  }

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
