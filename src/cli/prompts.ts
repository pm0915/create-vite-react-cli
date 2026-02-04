import { text, confirm, multiselect, cancel } from '@clack/prompts'
import { red, dim } from 'picocolors'
import { language } from '../locales'
import { FEATURE_OPTIONS } from '../constants'
import type { PromptResult } from '../types/index'
import { unwrapPrompt } from '../utils/cli/prompt'
import { isValidPackageName, toValidPackageName } from '../utils/helpers/package'
import { canSkipEmptying } from '../utils/fs/directory'

export async function collectOptions(
  initialTargetDir: string | undefined,
  defaultProjectName: string,
  forceOverwrite: boolean,
  isFeatureFlagsUsed: boolean,
): Promise<{ targetDir: string; result: PromptResult }> {
  let targetDir = initialTargetDir || defaultProjectName

  const result: PromptResult = {
    projectName: initialTargetDir || defaultProjectName,
    shouldOverwrite: forceOverwrite,
    packageName: initialTargetDir || defaultProjectName,
    features: [],
  }

  if (!initialTargetDir) {
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
            ? language.shouldOverwrite.dirForPrompts!.current
            : `${language.shouldOverwrite.dirForPrompts!.target} "${targetDir}"`
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

  return { targetDir, result }
}
