import { isCancel, cancel } from '@clack/prompts'
import { red } from 'picocolors'

function unwrapPrompt(promise) {
  return promise.then((result) => {
    if (isCancel(result)) {
      cancel(red('✖') + ' Operation cancelled')
      process.exit(0)
    }
    return result
  })
}

export { unwrapPrompt }
