import * as fs from 'node:fs'
import { intro, cancel, spinner } from '@clack/prompts'
import { red } from 'picocolors'
import { promptProjectName, DEFAULT_PROJECT_NAME } from './prompts/projectName'
import { resolveChoices } from './prompts/features'
import { resolveProjectName, resolveTargetDir } from './resolve/project'
import { processProjectFiles } from './render'
import { printNextSteps } from './output/nextSteps'
import { defaultBanner, gradientBanner } from './utils/banners'

async function createProject(projectNameArg, providedChoices = {}) {
  try {
    intro(
      process.stdout.isTTY && process.stdout.getColorDepth() > 8 ? gradientBanner : defaultBanner,
    )

    /**
     * CLI Result (Single Source of Truth)
     */
    const result = {
      projectName: undefined,
      packageName: undefined,
      targetDir: undefined,

      language: undefined,
      eslint: undefined,
      prettier: undefined,

      needsTypeScript: false,
    }

    /* ---------- project name ---------- */
    if (!projectNameArg) {
      const input = await promptProjectName()
      result.projectName = resolveProjectName(input, DEFAULT_PROJECT_NAME)
    } else {
      result.projectName = resolveProjectName(projectNameArg, DEFAULT_PROJECT_NAME)
    }

    result.packageName = result.projectName
    result.targetDir = await resolveTargetDir(result.projectName)

    /* ---------- features ---------- */
    const choices = await resolveChoices(providedChoices)
    result.language = choices.language
    result.eslint = choices.eslint
    result.prettier = choices.prettier

    /* ---------- derived ---------- */
    result.needsTypeScript = result.language === 'ts'

    /* ---------- execute ---------- */
    if (!fs.existsSync(result.targetDir)) {
      fs.mkdirSync(result.targetDir, { recursive: true })
    }

    await processProjectFiles(result)

    printNextSteps(result)
  } catch (error) {
    cancel(red('✖') + ` Error creating project: ${error.message}`)
    process.exit(1)
  }
}

export { createProject }
