#!/usr/bin/env zx
import 'zx/globals'

$.verbose = true

await $`pnpm run build`
await $`pnpm run snapshot`

const { version } = JSON.parse(await fs.readFile('./package.json'))

// Update the playground directory
const playgroundDir = path.resolve(__dirname, '../playground/')
cd(playgroundDir)

await $`pnpm install`
await $`pnpm dedupe`
await $`git add -A .`
try {
  await $`git commit -m "version ${version} snapshot"`
} catch (e) {
  if (!e.stdout.includes('nothing to commit')) {
    throw e
  }
}

await $`git tag -m "v${version}" v${version}`
await $`git push --follow-tags`

// Update the project root
const projectRoot = path.resolve(__dirname, '../')
cd(projectRoot)
await $`git add playground`
await $`git commit -m 'chore: update snapshot' --allow-empty`
await $`git push --follow-tags`
