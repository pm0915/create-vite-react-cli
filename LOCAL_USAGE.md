# 本地使用指南

## 方法一：直接使用 Node.js 运行（最简单）⭐

这是最直接的方式，无需安装：

```bash
# 在项目根目录下
node bin/cli.js 项目名称
```

### 示例：

```bash
# 创建名为 my-app 的项目
node bin/cli.js my-app

# 或者不提供项目名称，会提示输入
node bin/cli.js
```

## 方法二：使用 npm link（推荐用于开发）⭐

将本地包链接到全局，可以在任何地方使用：

```bash
# 1. 在项目根目录下执行
npm link

# 2. 现在可以在任何地方使用
create-vite-react-cli my-app
```

### 取消链接：

```bash
npm unlink -g create-vite-react-cli
```

## 方法三：全局安装本地包

```bash
# 在项目根目录下执行
npm install -g .

# 然后可以在任何地方使用
create-vite-react-cli my-app
```

### 卸载：

```bash
npm uninstall -g create-vite-react-cli
```

## 方法四：使用 npx（无需安装）

```bash
# 在项目根目录下
npx . my-app

# 或者使用完整路径
npx ./bin/cli.js my-app
```

## 使用流程示例

### 1. 确保依赖已安装

```bash
# 在项目根目录下
npm install
```

### 2. 运行 CLI 工具

```bash
# 方式一：直接运行（推荐）
node bin/cli.js my-vite-app

# 方式二：使用 npm link 后
create-vite-react-cli my-vite-app
```

### 3. 交互式选择或使用 CLI 参数

#### 方式 A：交互式选择（默认）

运行后会提示您选择：

```
? 选择语言: (Use arrow keys)
❯ JavaScript
  TypeScript

? 是否启用 ESLint? (Y/n)
? 是否启用 Prettier? (Y/n)
```

#### 方式 B：使用 CLI 参数（跳过交互式提示）

```bash
# 使用 TypeScript + ESLint + Prettier
node bin/cli.js my-app --typescript --eslint --prettier

# 使用 JavaScript，禁用 ESLint 和 Prettier
node bin/cli.js my-app --javascript --no-eslint --no-prettier

# 使用 TypeScript，只启用 ESLint
node bin/cli.js my-app --ts --eslint --no-prettier

# 查看所有可用参数
node bin/cli.js --help
```

**可用参数：**

- `--typescript, --ts` - 使用 TypeScript
- `--javascript, --js` - 使用 JavaScript (默认)
- `--eslint` - 启用 ESLint
- `--no-eslint` - 禁用 ESLint
- `--prettier` - 启用 Prettier
- `--no-prettier` - 禁用 Prettier

### 4. 项目创建完成后的步骤

```bash
# 进入项目目录
cd my-vite-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 完整示例

```bash
# 1. 进入项目目录
cd C:\Users\lenovo\LearnSpace\React\create-vite-react-cli

# 2. 确保依赖已安装
npm install

# 3. 创建新项目（TypeScript + ESLint + Prettier）
node bin/cli.js my-react-app

# 4. 按照提示选择：
#    - 语言: TypeScript
#    - ESLint: Yes
#    - Prettier: Yes

# 5. 进入新项目并安装依赖
cd my-react-app
npm install

# 6. 启动开发服务器
npm run dev
```

## 快速测试

```bash
# 方式一：交互式测试
node bin/cli.js test-project
# 然后选择 TypeScript + ESLint + Prettier

# 方式二：使用 CLI 参数快速测试
node bin/cli.js test-project --typescript --eslint --prettier

# 检查生成的文件
cd test-project
dir  # Windows
# 或 ls -la  # Linux/Mac

# 验证 TypeScript 配置
type tsconfig.json  # Windows
# 或 cat tsconfig.json  # Linux/Mac

# 验证 ESLint 配置
type .eslintrc.cjs  # Windows
# 或 cat .eslintrc.cjs  # Linux/Mac

# 验证 Prettier 配置
type .prettierrc  # Windows
# 或 cat .prettierrc  # Linux/Mac
```

## 常见问题

### Q: 提示找不到模块？

A: 确保在项目根目录下运行了 `npm install`

### Q: 权限错误？

A: 在 Windows 上，确保以管理员身份运行 PowerShell 或 CMD

### Q: 如何更新本地包？

A: 直接修改代码后，如果使用了 `npm link`，修改会立即生效

## 推荐方式

**开发阶段**：使用方法一（`node bin/cli.js`），最简单直接

**频繁使用**：使用方法二（`npm link`），一次设置，到处使用
