#!/usr/bin/env zx
import fs from 'node:fs'
import 'zx/globals'

$.verbose = false

if (!/pnpm/.test(process.env.npm_config_user_agent ?? ''))
  throw new Error("Please use pnpm ('pnpm run snapshot') to generate snapshots!")

const featureFlags = ['typescript', 'eslint', 'prettier']

// Generate all combinations of feature flags
function fullCombination(arr) {
  const combinations = []
  for (let i = 1; i < 1 << arr.length; i++) {
    const combo = []
    for (let j = 0; j < arr.length; j++) {
      if (i & (1 << j)) {
        combo.push(arr[j])
      }
    }
    combinations.push(combo)
  }
  return combinations
}

let flagCombinations = fullCombination(featureFlags)

flagCombinations.push(['default'])

const playgroundDir = path.resolve(__dirname, '../playground/')
cd(playgroundDir)

// remove all previous combinations
for (const flags of flagCombinations) {
  const projectName = flags.join('-')

  console.log(`Removing previously generated project ${projectName}`)
  fs.rmSync(projectName, { recursive: true, force: true })
}

// create all combinations
const bin = path.posix.relative('../playground/', '../bundle.js')

for (const flags of flagCombinations) {
  const projectName = flags.join('-')

  console.log(`Creating project ${projectName}`)
  await $`node ${[bin, projectName, ...flags.map((flag) => `--${flag}`), '--force']}`
}
