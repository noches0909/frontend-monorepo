# monorepo-lab 项目文档

## 1. 项目概览

这是一个基于 `pnpm workspaces` 的前端 Monorepo，用于在同一仓库中维护多应用、多共享包和统一工程规范。

- `@acme/next-app`：Next.js 16 + React 19 的 App Router 应用。
- `@acme/react-app`：Vite 7 + React 19 的独立前端应用。
- `@acme/ui`：共享 UI 组件、reset 样式与实验展示组件。
- `@acme/experiment-catalog`：共享实验/模型目录数据与类型。

仓库目标：

- 用一个 lockfile 管理跨应用依赖。
- 让 Next.js 与 Vite 应用共享组件和业务数据。
- 保持本地配置、账号绑定和密钥不进入版本库。
- 形成可重复的升级、验证和部署流程。

## 2. 工作区结构

```text
monorepo-lab/
├── apps/
│   ├── next-app/                 # Next.js App Router 应用
│   └── react-app/                # Vite + React 应用
├── packages/
│   ├── experiment-catalog/       # 共享实验/模型目录
│   └── ui/                       # 共享 UI 组件与样式
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── README.md
└── PROJECT.md
```

`pnpm-workspace.yaml` 当前配置：

- `apps/*`
- `packages/*`

## 3. 协作与提交边界

### 3.1 应提交的内容

提交面向团队共享、可审查、可复现的配置：

- 工作区配置：`package.json`、`pnpm-lock.yaml`、`pnpm-workspace.yaml`
- 应用配置：`next.config.js`、`vite.config.js`、`tsconfig.json`
- 代码质量配置：`eslint.config.*`
- 部署声明配置：`vercel.json`
- 共享包源码与类型声明
- 文档、示例、环境变量模板

### 3.2 不应提交的内容

不提交只属于某台机器、某个账号或某次工具运行的状态：

- `.claude/`：本地 AI 工具设置、权限偏好、机器相关状态。
- `.vercel/`：本地 Vercel 链接、账号/项目绑定、拉取到本地的环境变量。
- `.env*.local`：本地密钥和私有环境变量。
- `node_modules/`、`.next/`、`dist/`、缓存目录。
- 系统文件，如 `.DS_Store`。

判断原则：

- 多个协作者必须一致，且不包含密钥/账号状态：可以提交。
- 只描述如何配置，而不是保存某个人配置结果：写进文档或模板。
- 来自本机登录、工具生成、缓存或构建输出：忽略。

### 3.3 已跟踪文件的处理

`.gitignore` 只会阻止未跟踪的新文件。若文件已经被 Git 跟踪，加入 `.gitignore` 后仍会继续出现在提交里，需要从索引移除一次，同时保留本地文件：

```bash
git rm --cached <path>
```

例如：

```bash
git rm --cached .claude/settings.local.json
```

## 4. 技术栈与版本

运行环境：

- Node.js `v24.12.0`
- pnpm `10.0.0`

Next 应用核心依赖：

- `next@16.1.6`
- `react@19.2.4`
- `react-dom@19.2.4`
- `eslint-config-next@16.1.6`
- `eslint@9.39.3`

React 应用核心依赖：

- `vite@7.3.1`
- `react@19.2.4`
- `react-dom@19.2.4`
- `react-router-dom@7.9.4`
- `eslint@9.39.3`

共享包核心依赖：

- `@acme/ui` 依赖 `antd@6.3.1`，并将 React / React DOM 作为 peer dependencies。
- `@acme/experiment-catalog` 暴露共享数据入口与类型声明。

## 5. 应用与包说明

### 5.1 apps/next-app

- 使用 App Router（`app/` 目录）。
- 首页文案从 `mock.json` / `enMock.json` 提供，`home-copy.ts` 负责语言常量与 cookie 处理。
- 首页语言切换逻辑已改为服务端读取 cookie 初始值，避免客户端 `useEffect` 同步 `setState` 触发新版本 React Hooks lint 错误。
- 依赖 `@acme/ui` 与 `@acme/experiment-catalog`。

### 5.2 apps/react-app

- 由 Vite 驱动，入口为 `src/main.jsx`。
- 页面核心组件为 `src/components/ModelComparison.jsx`。
- 依赖 `@acme/ui` 与 `@acme/experiment-catalog`。

### 5.3 packages/ui

- 提供跨应用复用的 UI 组件与样式文件。
- `antd` 是包内依赖，React / React DOM 由宿主应用提供。
- 通过 `exports` 暴露 JS、类型声明和 CSS 入口。

### 5.4 packages/experiment-catalog

- 提供共享实验/模型目录数据。
- 通过 `exports` 暴露 JS 与类型声明入口。

## 6. 开发与构建命令

在仓库根目录执行：

```bash
pnpm install
```

根脚本（当前默认针对 Next 应用）：

```bash
pnpm dev:next
pnpm dev:react
pnpm build
pnpm lint
pnpm start
```

按应用执行：

```bash
pnpm --filter @acme/next-app dev
pnpm --filter @acme/next-app lint
pnpm --filter @acme/next-app build

pnpm --filter @acme/react-app dev
pnpm --filter @acme/react-app lint
pnpm --filter @acme/react-app build
```

共享包没有独立构建脚本，当前由应用侧直接消费工作区源码入口。

## 7. Vercel 与环境变量

仓库可以提交 `vercel.json` 这类声明式部署配置，但不提交 `.vercel/`。

推荐协作方式：

1. 每位协作者在本机自行执行 Vercel 登录与项目链接。
2. 使用 Vercel Dashboard 或 CLI 管理真实环境变量。
3. 在仓库中维护 `.env.example` 或文档说明，列出变量名、用途和是否必填。
4. 本地私有值写入 `.env.local` 或对应应用目录下的本地环境文件。

这样可以共享部署规则，又不会把某个人的账号绑定、项目链接或密钥带给其他人。

## 8. 依赖检查与升级结论

本次已完成：

- 工作区依赖整体升级到最新可用版本（含 major）。
- 升级后进行双应用 `lint/build` 回归验证。
- 修复升级引入的兼容问题并再次验证通过。

当前仍显示“可升级但暂不建议立即升级”的包：

- `eslint`：`9.39.3` -> `10.0.2`
- `@eslint/js`：`9.39.3` -> `10.0.1`

暂缓升级原因：

- `eslint-config-next@16.1.6` 依赖链中的多个插件对 ESLint 10 仍存在 peer 范围不匹配，升级会引入噪声告警与潜在规则行为不一致。

## 9. 已处理的兼容性问题

### 问题 A：Next 16 后 `next lint` 不再可直接沿用

- 现象：执行 `next lint` 报 “Invalid project directory .../lint”。
- 处理：改为 `eslint .`，并新增 `apps/next-app/eslint.config.mjs` 使用 `eslint-config-next/core-web-vitals`。

### 问题 B：ESLint 10 与 Next ESLint 生态 peer 冲突

- 现象：`pnpm up` 后出现 `eslint-plugin-import/react-hooks/jsx-a11y/react` 等 peer mismatch。
- 处理：将 `apps/next-app` 与 `apps/react-app` 的 `eslint` 统一回 `9.39.x`，并将 `@eslint/js` 对齐 `9.39.x`。

### 问题 C：React Hooks 新规则阻断 lint

- 现象：`react-hooks/set-state-in-effect` 报错（在 `useEffect` 内同步调用 `setState`）。
- 处理：将语言初始值改为服务端通过 cookie 传入客户端组件，移除该模式下的 effect 内初始化状态。

## 10. 维护建议

- 依赖升级建议按“框架层（Next/React/Vite）-> 构建层 -> lint 层”分批进行，避免一次升级难以定位问题。
- 在升级 `eslint` 到 10 之前，先确认 `eslint-config-next` 及其插件链对 ESLint 10 的 peer 声明已稳定。
- 继续保留“升级后立即双应用 lint/build 回归”的流程作为标准操作。
- 新增共享配置时，优先判断它是“团队约定”还是“本地状态”；团队约定提交，本地状态写入 `.gitignore`。
- 新增环境变量时，同步更新文档或 `.env.example`，不要提交真实值。
