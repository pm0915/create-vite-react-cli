import { it, describe, expect } from 'vitest'
import sortDependencies from '../src/utils/helpers/sortDependencies'

describe('sortDependencies', () => {
  it('should sort dependencies and dev dependencies', () => {
    const packageJson = {
      dependencies: {
        zustand: '^5.0.9',
        react: '^19.2.0',
        axios: '^1.13.2',
        'react-router': '^7.12.0',
        'react-dom': '^19.2.0',
      },
      devDependencies: {
        vite: '^7.2.4',
        '@vitejs/plugin-react-swc': '^4.2.2',
        typescript: '~5.9.3',
        eslint: '^9.39.1',
        'eslint-plugin-react-hooks': '^7.0.1',
        '@types/react-dom': '^19.2.3',
        'eslint-plugin-react-refresh': '^0.4.24',
        'typescript-eslint': '^8.46.4',
        '@types/node': '^24.10.1',
        globals: '^16.5.0',
        '@types/react': '^19.2.5',
        '@eslint/js': '^9.39.1',
      },
    }

    expect(sortDependencies(packageJson)).toStrictEqual({
      dependencies: {
        axios: '^1.13.2',
        react: '^19.2.0',
        'react-dom': '^19.2.0',
        'react-router': '^7.12.0',
        zustand: '^5.0.9',
      },
      devDependencies: {
        '@eslint/js': '^9.39.1',
        '@types/node': '^24.10.1',
        '@types/react': '^19.2.5',
        '@types/react-dom': '^19.2.3',
        '@vitejs/plugin-react-swc': '^4.2.2',
        eslint: '^9.39.1',
        'eslint-plugin-react-hooks': '^7.0.1',
        'eslint-plugin-react-refresh': '^0.4.24',
        globals: '^16.5.0',
        typescript: '~5.9.3',
        'typescript-eslint': '^8.46.4',
        vite: '^7.2.4',
      },
    })
  })
})
