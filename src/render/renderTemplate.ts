import * as fs from 'node:fs'
import * as path from 'node:path'

import deepMerge from '../utils/deepMerge'
import sortDependencies from '../utils/sortDependencies'

function renderTemplate(
  src: string,
  dest: string,
  callbacks: Function[] = [],
  ejsFiles: {
    src: string
    dest: string
    key: string
  }[] = [],
) {
  const stats = fs.statSync(src)

  // Directory
  if (stats.isDirectory()) {
    if (path.basename(src) === 'node_modules') return

    fs.mkdirSync(dest, { recursive: true })
    const files = fs.readdirSync(src)
    for (const file of files) {
      renderTemplate(path.resolve(src, file), path.resolve(dest, file), callbacks, ejsFiles)
    }
    return
  }

  let filename = path.basename(src)

  /* ---------- package.json: deep merge ---------- */
  if (filename === 'package.json' && fs.existsSync(dest)) {
    const existing = JSON.parse(fs.readFileSync(dest, 'utf8'))
    const incoming = JSON.parse(fs.readFileSync(src, 'utf8'))
    const merged = sortDependencies(deepMerge(existing, incoming))
    fs.writeFileSync(dest, JSON.stringify(merged, null, 2) + '\n')
    return
  }

  /* ---------- `_file` → `.file` ---------- */
  if (filename.startsWith('_')) {
    filename = filename.replace(/^_/, '.')
    dest = path.resolve(path.dirname(dest), filename)
  }

  /* ---------- .gitignore: append ---------- */
  if (filename === '.gitignore' && fs.existsSync(dest)) {
    const existing = fs.readFileSync(dest, 'utf8')
    const incoming = fs.readFileSync(src, 'utf8')
    fs.writeFileSync(dest, `${existing}\n${incoming}`)
    return
  }

  /* ---------- EJS templates: collect ---------- */
  if (filename.endsWith('.ejs')) {
    const finalDest = path.resolve(dest.replace(/\.ejs$/, ''))
    ejsFiles.push({
      src,
      dest: finalDest,
      key: path.basename(finalDest),
    })
    return
  }

  /* ---------- Default: copy ---------- */
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(src, dest)
}

export { renderTemplate }
