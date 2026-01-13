# `create-vite-react-cli` Contributing Guide

Welcome! 🎉  
We’re excited that you’re interested in contributing to `create-vite-react-cli`. Before submitting your contribution, please take a moment to read this guide carefully.

## Development Setup

Follow these steps to set up the project locally:

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Build the Project

The CLI is written in TypeScript, so you need to build it first:

```bash
pnpm run build
```

### 3. (Optional) Create a Global Link

If you want to test the CLI globally:

```bash
pnpm link
```

This allows you to run `create-vite-react-cli` from anywhere on your system.

### 4. Run the CLI Tool

- **Option 1 (Recommended):** Run locally in dev mode

```bash
pnpm run dev
```

- **Option 2:** Use the global link (if created)

```bash
create-vite-react-cli my-vite-app
```
