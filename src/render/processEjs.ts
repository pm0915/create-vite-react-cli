import * as fs from 'node:fs'
import * as path from 'node:path'
import ejs from 'ejs'

function processEjsFiles(
  ejsFiles: { src: string; dest: string; key: string }[],
  dataStore: Record<string, unknown>,
) {
  if (!ejsFiles.length) return

  for (const { src, dest, key } of ejsFiles) {
    const template = fs.readFileSync(src, 'utf8')

    const templateData = dataStore[key] || dataStore.default || {}

    try {
      const content = ejs.render(template, templateData)

      fs.mkdirSync(path.dirname(dest), { recursive: true })
      fs.writeFileSync(dest, content)
    } catch (err) {
      console.error(`Error rendering template ${src}:`, err)
    }
  }
}

export { processEjsFiles }
