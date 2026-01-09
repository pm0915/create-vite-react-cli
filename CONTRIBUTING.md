# `create-vite-react-cli` Contributing Guide

Welcome! 🎉  
We’re excited that you’re interested in contributing to `create-vite-react-cli`. Before submitting your contribution, please take a moment to read this guide carefully.

---

## Repo Setup

This repository uses **[Git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)** to store snapshots of the created templates after each release.

When cloning the repo, make sure to include submodules:

```bash
git clone --recursive https://github.com/pm0915/create-vite-react-cli.git
```

> If you already cloned the repository without `--recursive`, run the following to initialize submodules:

```bash
git submodule update --init --recursive
```

This is a **monorepo** using **pnpm workspaces**. Ensure you have [pnpm](https://pnpm.io/) installed to manage dependencies and link packages.

---

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

---

## Pull Request Guidelines

- Always create a **topic branch** from the base branch (e.g., `main`) and merge back into that branch.
- For **non-trivial features or bug fixes**, please **open an issue first** and get approval before working on it.
- Do **not commit the `playground` directory**—it is updated automatically after each release.

---

## Node.js Compatibility

This project supports **all actively maintained Node.js LTS versions**.

- GitHub Actions run tests on multiple Node.js versions to ensure compatibility.
- Once an LTS version reaches end-of-life, support will be dropped.
- We recommend using the **latest active LTS version** for development.
- Dependencies such as `@tsconfig/node*` and `@types/node` are synced with the latest active LTS.

Node.js release schedule: [Node.js Release Working Group](https://github.com/nodejs/release#release-schedule)

---
