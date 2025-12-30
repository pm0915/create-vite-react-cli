# 本地使用指南

### 1. 确保依赖已安装

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

### 3. 运行 CLI 工具

```bash
# 方式一：直接运行（推荐）
node bundle.js my-vite-app

# 方式二：使用 npm link 后
create-vite-react-cli my-vite-app
```
