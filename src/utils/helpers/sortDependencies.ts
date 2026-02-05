export default function sortDependencies(
  packageJson: Record<string, unknown>,
): Record<string, unknown> {
  const sorted: Record<string, Record<string, unknown>> = {};

  const depTypes = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];

  for (const depType of depTypes) {
    const dependencies = packageJson[depType] as Record<string, unknown>;
    if (dependencies && typeof dependencies === 'object' && dependencies !== null) {
      sorted[depType] = {};

      Object.keys(dependencies)
        .sort()
        .forEach((name) => {
          sorted[depType][name] = dependencies[name];
        });
    }
  }

  return {
    ...packageJson,
    ...sorted,
  };
}
