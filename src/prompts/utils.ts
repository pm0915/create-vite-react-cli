import { isCancel, cancel } from '@clack/prompts'
import { red } from 'picocolors'

function unwrapPrompt(promise) {
  return promise.then((result) => {
    if (isCancel(result)) {
      cancel(red('✖') + ' 操作已取消')
      process.exit(0)
    }
    return result
  })
}

export { unwrapPrompt }
