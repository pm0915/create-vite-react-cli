# create-vite-react-cli

一个快速创建基于 Vite 的 React 项目的脚手架工具。

## 功能特性

- ⚡️ 基于 Vite，极速启动
- ⚛️ 使用 React 18
- 🎨 开箱即用的项目模板
- 📦 自动配置 TypeScript 类型支持
- 🚀 现代化的开发体验

## 安装

### 全局安装

```bash
npm install -g create-vite-react-cli
```

### 使用 npx（推荐）

```bash
npx create-vite-react-cli my-app
```

## 使用方法

### 基本用法

```bash
create-vite-react my-app
```

或者使用 npx：

```bash
npx create-vite-react-cli my-app
```

### 交互式创建

如果不提供项目名称，工具会提示您输入：

```bash
create-vite-react
```

## 项目结构

创建的项目包含以下结构：

```
my-app/
├── public/
│   ├── vite.svg
│   └── react.svg
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 创建后的步骤

1. 进入项目目录：
   ```bash
   cd my-app
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

4. 构建生产版本：
   ```bash
   npm run build
   ```

5. 预览生产构建：
   ```bash
   npm run preview
   ```

## 发布到 npm

1. 确保已登录 npm：
   ```bash
   npm login
   ```

2. 发布包：
   ```bash
   npm publish
   ```

## 许可证

MIT

## 作者

Pan Min

