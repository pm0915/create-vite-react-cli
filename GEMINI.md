# create-vite-react-cli

## Project Overview

`create-vite-react-cli` is a command-line tool for scaffolding Vite-powered React projects. It provides a streamlined setup process with interactive prompts and various feature flags.

### Key Technologies

- **Runtime:** Node.js (^20.19.0 or >=22.12.0)
- **Language:** TypeScript
- **Package Manager:** pnpm
- **Build Tool:** `tsdown` (for bundling the CLI)
- **Testing:** `vitest`
- **Linting & Formatting:** `oxlint` and `oxfmt`
- **CLI Framework:** `@clack/prompts` for interactive UI, `picocolors` for styling.
- **Templating:** `ejs` for dynamic file generation.

## Directory Structure

- `src/`: Core logic of the CLI.
  - `help/`: CLI help documentation logic.
  - `locales/`: Internationalization support.
  - `utils/`: Utility functions (templating, directory operations, dependency sorting, etc.).
- `templates/`: Base project templates and optional feature configurations (TypeScript, ESLint, Prettier).
- `locales/`: Localization JSON files (en-US, zh-Hans).
- `test/`: Unit tests for internal utilities.
- `index.js`: Main entry point for the published package.

## Building and Running

### Installation

```bash
pnpm install
```

### Development

1. Start the compiler in watch mode:
   ```bash
   pnpm run dev
   ```
2. Run the CLI locally:
   ```bash
   node index.js [my-app-name] [options]
   ```

### Production Build

```bash
pnpm run build
```

### Verification

- **Test:** `pnpm test`
- **Typecheck:** `pnpm run typecheck`
- **Lint:** `pnpm run lint`
- **Format:** `pnpm run format`

## Feature Flags

- `--ts` / `--typescript`: Enable TypeScript.
- `--eslint`: Add ESLint support.
- `--prettier`: Add Prettier support.
- `--force`: Overwrite existing directory.
- `--default`: Skip prompts and use default configuration.

## Development Conventions

- **Tooling:** Uses `oxlint` and `oxfmt` for extremely fast linting and formatting.
- **Git Hooks:** Managed by `husky` and `lint-staged` to ensure code quality before commits.
- **Releases:** Uses `bumpp` for versioning and `changelogen` for automated changelog generation.
- **Architecture:** Follows a modular structure in `src/utils` for handling template rendering and dependency management.
