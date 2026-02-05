import { describe, expect, it } from 'vitest'
import { detectPackageManager } from '../src/utils/cli/packageManager'

describe('detectPackageManager', () => {
  it('detects pnpm', () => {
    expect(detectPackageManager('pnpm/9.0.0')).toBe('pnpm')
  })

  it('detects yarn', () => {
    expect(detectPackageManager('yarn/4.0.0')).toBe('yarn')
  })

  it('detects bun', () => {
    expect(detectPackageManager('bun/1.0.0')).toBe('bun')
  })

  it('defaults to npm', () => {
    expect(detectPackageManager('npm/10.0.0')).toBe('npm')
  })
})
