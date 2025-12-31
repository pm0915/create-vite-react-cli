# 本地使用指南

本指南将帮助您在本地环境中设置和使用 `create-vite-react-cli` 工具。

### 1. 确保依赖已安装

首先，确保所有项目依赖都已安装：

```bash
# 在项目根目录下
npm install
```

### 2. 构建项目

由于 CLI 是基于 TypeScript 编写的，需要先构建生成可执行文件：

```bash
# 构建项目
npm run build
```

### 3. 创建全局链接（可选，用于全局测试）

如果您想在全局范围内测试 CLI 工具，可以创建符号链接：

```bash
# 创建全局链接
npm link
```

这将允许您在任何地方使用 `create-vite-react-cli` 命令，而无需指定完整路径。

### 4. 运行 CLI 工具

构建完成后，您可以通过以下方式运行 CLI 工具：

#### 方式一：直接运行（推荐）

```bash
node bundle.js my-vite-app
```

#### 方式二：使用全局链接（如果已创建）

```bash
create-vite-react-cli my-vite-app
```
