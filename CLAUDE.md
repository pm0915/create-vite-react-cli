# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`create-vite-react-cli` is a CLI tool for scaffolding Vite-powered React projects. It's built with TypeScript and uses EJS for dynamic template rendering. The tool supports interactive prompts and feature flags for TypeScript, ESLint, and Prettier.

## Development Commands

```bash
# Install dependencies (must use pnpm)
pnpm install

# Development - watch mode
pnpm run dev
# Then in another terminal:
node index.js [project-name] [options]

# Production build
pnpm run build

# Type checking
pnpm run typecheck

# Linting
pnpm run lint
pnpm run lint:fix

# Formatting
pnpm run format

# Run tests
pnpm test
```

## Architecture

### Entry Point

`src/index.ts` - Main CLI entry point that:

1. Parses command-line arguments using Node.js `parseArgs`
2. Handles feature flags (`--ts`, `--eslint`, `--prettier`, `--force`, `--default`, `--help`, `--version`)
3. Displays help/version when requested
4. Collects user options via interactive prompts (via `src/cli/prompts.ts`)
5. Calls `scaffoldProject` to generate the project
6. Outputs instructions for the created project

### Core Scaffolding

`src/core/scaffold.ts` - Template rendering system:

- Uses EJS for dynamic template rendering
- Renders templates in a specific order: base → configs → code → entry
- Supports feature combinations (TypeScript, ESLint, Prettier)
- Generates `tsconfig.json` programmatically when TypeScript is enabled
- Uses a callback system to share data across template rendering stages
- Handles file renaming (JS→TS/TSX) and cleanup based on selected features

### Template Structure

Templates are organized by feature in `templates/`:

- `base/` - Core Vite + React setup (vite.config, package.json base)
- `code/` - Source code templates (`default` for JS, `typescript-` for TS)
- `config/` - Additional configurations (TypeScript config)
- `entry/` - Entry point templates (index.html, main.ts/js)
- `formatting/` - Prettier configuration
- `linting/` - ESLint configurations with TypeScript/JS variants
- `tsconfig/` - TypeScript configurations (base, node, app)

Template files use `.ejs` extension and are processed with data from the callback system. The `dataStore` allows templates to share data (e.g., project name, entry extension).

### Utility Modules

`src/utils/`:

- `cli/` - CLI helpers (banners, command generation, language detection)
- `fs/` - File system operations (directory traversal, template rendering)
- `helpers/` - Helper functions (deep merge, dependency sorting)

### Internationalization

`src/locales.ts` - Language management

- Supports English (en-US) and Chinese (zh-Hans)
- Locale files stored in `locales/` directory
- Language detection via system environment

### Constants

`src/constants.ts` defines:

- `DEFAULT_PROJECT_NAME`: "my-vite-react-app"
- `TEMPLATE_ROOT`: Path to templates directory
- `FEATURE_FLAGS`: Array of CLI feature flags
- `FEATURE_OPTIONS`: Interactive prompt options

## Build System

- **Build Tool**: `tsdown` - Compiles TypeScript to JavaScript
- **Output**: `dist/` directory (ESM format)
- **Package Entry**: `index.js` (symlink to `dist/index.mjs`)
- **Type Declaration**: Generated separately (`emitDeclarationOnly: true`)

The `tsdown.config.ts` is minimal and uses default ESM exports.

## Testing

Tests are located in `test/` and use Vitest. Test files cover:

- Command generation utilities
- Internationalization
- Template rendering
- Dependency sorting

Run with `pnpm test`. Tests are also run as part of the release pre-hooks.

## Code Quality

- **Linter**: `oxlint` - Extremely fast Node.js linter
- **Formatter**: `oxfmt` - Fast formatter (no semicolons, single quotes)
- **Git Hooks**: Managed by `husky` with `lint-staged`
- **Pre-commit**: Runs `oxlint --fix` and `oxfmt` on staged files

## Release Process

Uses `release-it` with `@release-it/conventional-changelog` plugin:

- Version bumping: `patch`, `minor`, `major`
- Pre-release hooks run `typecheck`, `lint`, and `test`
- Post-bump hook runs `build`
- Changelog generated from conventional commits
- Requires clean working directory on `main` branch

Feature flags for releases:

- `feat` → Features
- `fix` → Bug Fixes
- `perf` → Performance Improvements
- `docs` → Documentation
- `style` → Styles
- `refactor` → Code Refactoring
- `test` → Tests
- `build` → Build System
- `ci` → Continuous Integration
- `chore` → Chores

## Key Concepts

### Feature Flag Handling

When any feature flag is used (`--ts`, `--eslint`, `--prettier`), interactive prompts for features are skipped. The `--default` flag skips all prompts and uses default configuration.

### Template Rendering Order

Templates are rendered in this specific order to ensure dependencies work correctly:

1. `base` - Essential project files
2. `config/typescript` (if needed)
3. `tsconfig/base`, `tsconfig/app`, `tsconfig/node` (if TS)
4. `linting/base` (if ESLint)
5. `linting/core/ts` or `linting/core/js` (if ESLint)
6. `linting/prettier` (if ESLint + Prettier)
7. `formatting/prettier` (if Prettier alone)
8. `code/default` or `code/typescript-`
9. `entry/default`

### Callback System

The `callbacks` array in `scaffold.ts` allows templates to register functions that populate `dataStore`. These callbacks are executed after all templates are copied but before EJS rendering, allowing data sharing across templates.

### Package Manager Detection

The CLI detects the user's package manager from `npm_config_user_agent` and prioritizes: pnpm > yarn > bun > npm. This detection is used to generate appropriate post-creation instructions.

## Node.js Version

Requires Node.js ^20.19.0 || >=22.12.0 as specified in `package.json` engines.
