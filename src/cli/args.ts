import { parseArgs } from 'node:util'
import { FEATURE_FLAGS } from '../constants'

export const CLI_FLAGS = [...FEATURE_FLAGS, 'force', 'help', 'version'] as const

export type CliFlag = (typeof CLI_FLAGS)[number]

export type CliArgv = {
  [key in CliFlag]?: boolean
}

export function parseCliArgs(args: string[]) {
  const options = Object.fromEntries(
    CLI_FLAGS.map((key) => [key, { type: 'boolean' }]),
  ) as Record<CliFlag, { type: 'boolean' }>

  return parseArgs({
    args,
    options,
    strict: true,
    allowPositionals: true,
  })
}

export function areFeatureFlagsUsed(argv: CliArgv) {
  return FEATURE_FLAGS.some((flag) => typeof argv[flag] === 'boolean')
}
