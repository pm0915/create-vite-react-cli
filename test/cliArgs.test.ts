import { describe, expect, it } from 'vitest';
import { areFeatureFlagsUsed, parseCliArgs } from '../src/cli/args';

describe('parseCliArgs', () => {
  it('parses flags and positionals', () => {
    const { values, positionals } = parseCliArgs(['my-app', '--ts', '--force']);

    expect(positionals).toEqual(['my-app']);
    expect(values.ts).toBe(true);
    expect(values.force).toBe(true);
  });

  it('detects feature flags usage', () => {
    const { values } = parseCliArgs(['--eslint']);

    expect(areFeatureFlagsUsed(values)).toBe(true);
  });
});
