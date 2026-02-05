export type PackageManager = 'pnpm' | 'yarn' | 'bun' | 'npm';

export function detectPackageManager(
  userAgent: string = process.env.npm_config_user_agent ?? '',
): PackageManager {
  if (/pnpm/.test(userAgent)) {
    return 'pnpm';
  }
  if (/yarn/.test(userAgent)) {
    return 'yarn';
  }
  if (/bun/.test(userAgent)) {
    return 'bun';
  }
  return 'npm';
}
