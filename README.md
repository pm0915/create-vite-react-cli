# create-vite-react-cli

一个快速创建基于 Vite 的 React 项目的脚手架工具。

## 使用方法

### 推荐方式（最简单）

```bash
npm create vite-react-cli my-app
```

这是最推荐的使用方式，npm 会自动下载并执行最新版本的脚手架工具。

### 其他使用方式

#### 使用 npx

```bash
npx create-vite-react-cli my-app
```

#### 全局安装后使用

```bash
npm install -g create-vite-react-cli
create-vite-react-cli my-app
```

### 交互式创建

默认情况下，命令会以交互模式运行，提示您选择项目配置：

```bash
npm create vite-react-cli my-app
```

### 使用 CLI 参数（跳过交互式提示）

您可以通过 CLI 参数跳过交互式提示：

```bash
# 使用 TypeScript + ESLint + Prettier
npm create vite-react-cli my-app --typescript --eslint --prettier

# 使用 JavaScript，禁用 ESLint 和 Prettier
npm create vite-react-cli my-app --javascript --no-eslint --no-prettier

# 使用 TypeScript，只启用 ESLint
npm create vite-react-cli my-app --ts --eslint --no-prettier
```

#### 可用参数

- `--typescript, --ts` - 使用 TypeScript
- `--javascript, --js` - 使用 JavaScript (默认)
- `--eslint` - 启用 ESLint
- `--no-eslint` - 禁用 ESLint
- `--prettier` - 启用 Prettier
- `--no-prettier` - 禁用 Prettier
- `--help` - 显示帮助信息

**注意**: 如果不提供任何参数，工具会以交互模式运行，提示您选择配置选项。

## 功能特性

- ✅ **TypeScript 支持** - 可选择使用 TypeScript 或 JavaScript
- ✅ **ESLint 集成** - 可选的代码检查工具，支持 TypeScript 和 JavaScript
- ✅ **Prettier 集成** - 可选的代码格式化工具
- ✅ **Vite 构建** - 基于 Vite 的快速开发体验
- ✅ **React 18** - 使用最新的 React 版本

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

6. 代码检查（如果启用了 ESLint）：

   ```bash
   npm run lint
   ```

7. 代码格式化（如果启用了 Prettier）：

   ```bash
   npm run format
   ```

## 项目结构

创建的项目包含以下结构：

```
my-app/
├── public/          # 静态资源
├── src/             # 源代码
│   ├── App.jsx      # 或 App.tsx (如果选择 TypeScript)
│   ├── main.jsx     # 或 main.tsx (如果选择 TypeScript)
│   └── ...
├── index.html        # HTML 入口文件
├── vite.config.js    # 或 vite.config.ts (如果选择 TypeScript)
├── package.json      # 项目配置
└── ...
```

如果选择了 TypeScript，还会包含：

- `tsconfig.json` - TypeScript 配置
- `tsconfig.node.json` - Node.js TypeScript 配置

如果启用了 ESLint，会包含：

- `.eslintrc.cjs` - ESLint 配置文件

如果启用了 Prettier，会包含：

- `.prettierrc` - Prettier 配置
- `.prettierignore` - Prettier 忽略文件

## 与 create-react-app 的区别

- **Vite 驱动**: 基于 Vite 而非 webpack，提供更快的开发体验
- **脚手架工具**: 仅负责项目搭建，后续构建由 Vite 处理
- **现代化**: 支持最新的 React 和构建工具特性

## 许可证

MIT

## 作者

Pan Min
