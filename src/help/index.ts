import { cyan } from 'picocolors'

export const helpMessage = `\
Usage: create-vite-react-cli [FEATURE_FLAGS...] [OPTIONS...] [DIRECTORY]

Create a new Vite React project.
Start the CLI in interactive mode when no FEATURE_FLAGS is provided, or if the DIRECTORY argument is not a valid package name.

Options:
  --force
    Create the project even if the directory is not empty.
  --help
    Display this help message.
  --version
    Display the version number of this CLI.

Available feature flags:
  --default
    Create a project with the default configuration without any additional features.
  --ts, --typescript
    Add TypeScript support.
  --eslint
    Add ESLint for code quality.
  --eslint-with-prettier (Deprecated in favor of ${cyan('--eslint --prettier')})
    Add Prettier for code formatting in addition to ESLint.
  --prettier
    Add Prettier for code formatting.
`
