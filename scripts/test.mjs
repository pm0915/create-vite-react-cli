#!/usr/bin/env zx
import fs from 'node:fs'
import 'zx/globals'

$.verbose = false

const playgroundDir = path.resolve(__dirname, '../playground/')

let projects = fs
  .readdirSync(playgroundDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)
  .filter((name) => !name.startsWith('.') && name !== 'node_modules')

if (process.argv[2]) {
  projects = projects.filter((project) => project.includes(process.argv[2]))
}

cd(playgroundDir)
console.log('Installing playground dependencies...')
await $`pnpm install`

for (const projectName of projects) {
  cd(path.resolve(playgroundDir, projectName))
  const packageJSON = require(path.resolve(playgroundDir, projectName, 'package.json'))

  console.log(`

#####
Building ${projectName}
#####

  `)

  if ('build' in packageJSON.scripts) {
    await $`pnpm run build`
  }

  if ('test:unit' in packageJSON.scripts) {
    console.log(`Running unit tests in ${projectName}`)
    if (projectName.includes('vitest')) {
      await $`CI=1 pnpm run test:unit`
    } else {
      await $`pnpm run test:unit`
    }
  }

  if ('type-check' in packageJSON.scripts) {
    console.log(`Running type-check in ${projectName}`)
    await $`pnpm run type-check`
  }
}
