import { isCancel, cancel } from '@clack/prompts'
import { red } from 'picocolors'
import { language } from '../../locales/index'

export async function unwrapPrompt<T>(maybeCancelPromise: Promise<T | symbol>): Promise<T> {
  const result = await maybeCancelPromise

  if (isCancel(result)) {
    cancel(red('✖') + ` ${language.errors.operationCancelled}`)
    process.exit(0)
  }
  return result
}
