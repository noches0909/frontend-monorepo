# frontend-monorepo 项目文档

## 1. 项目概览

这是一个基于 `pnpm workspaces` 的前端 Monorepo，当前包含两个应用：

- `@acme/next-app`：Next.js 16 + React 19 的 App Router 应用。
- `@acme/react-app`：Vite 7 + React 19 + Ant Design 6 的独立前端应用。

仓库目标是同时维护多前端技术栈，并在同一工作区中统一依赖管理与工程规范。

## 2. 工作区结构

```text
frontend-monorepo/
├── apps/
│   ├── next-app/    # Next.js 应用
│   └── react-app/   # Vite + React 应用
├── package.json
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

`pnpm-workspace.yaml` 当前配置：

- `apps/*`
- `packages/*`（目录预留，当前无实际包）

## 3. 技术栈与版本（2026-02-28）

运行环境（本次检查）：

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
- `antd@6.3.1`
- `eslint@9.39.3`

## 4. 应用说明

### 4.1 apps/next-app

- 使用 App Router（`app/` 目录）。
- 首页文案从 `mock.json` / `enMock.json` 提供，`home-copy.ts` 负责语言常量与 cookie 处理。
- 首页语言切换逻辑已改为服务端读取 cookie 初始值，避免客户端 `useEffect` 同步 `setState` 触发新版本 React Hooks lint 错误。

### 4.2 apps/react-app

- 由 Vite 驱动，入口为 `src/main.jsx`。
- 页面核心组件为 `src/components/ModelComparison.jsx`。
- 使用 Ant Design reset 样式（`antd/dist/reset.css`）。

## 5. 开发与构建命令

在仓库根目录执行：

```bash
pnpm install
```

根脚本（当前默认针对 Next 应用）：

```bash
pnpm dev
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

## 6. 本次依赖检查与升级结论

本次已完成：

- 工作区依赖整体升级到最新可用版本（含 major）。
- 升级后进行双应用 `lint/build` 回归验证。
- 修复升级引入的兼容问题并再次验证通过。

当前仍显示“可升级但暂不建议立即升级”的包：

- `eslint`：`9.39.3` -> `10.0.2`
- `@eslint/js`：`9.39.3` -> `10.0.1`

暂缓升级原因：

- `eslint-config-next@16.1.6` 依赖链中的多个插件对 ESLint 10 仍存在 peer 范围不匹配，升级会引入噪声告警与潜在规则行为不一致。

## 7. 已处理的兼容性问题

### 问题 A：Next 16 后 `next lint` 不再可直接沿用

- 现象：执行 `next lint` 报 “Invalid project directory .../lint”。
- 处理：改为 `eslint .`，并新增 `apps/next-app/eslint.config.mjs` 使用 `eslint-config-next/core-web-vitals`。

### 问题 B：ESLint 10 与 Next ESLint 生态 peer 冲突

- 现象：`pnpm up` 后出现 `eslint-plugin-import/react-hooks/jsx-a11y/react` 等 peer mismatch。
- 处理：将 `apps/next-app` 与 `apps/react-app` 的 `eslint` 统一回 `9.39.x`，并将 `@eslint/js` 对齐 `9.39.x`。

### 问题 C：React Hooks 新规则阻断 lint

- 现象：`react-hooks/set-state-in-effect` 报错（在 `useEffect` 内同步调用 `setState`）。
- 处理：将语言初始值改为服务端通过 cookie 传入客户端组件，移除该模式下的 effect 内初始化状态。

## 8. 维护建议

- 依赖升级建议按“框架层（Next/React/Vite）-> 构建层 -> lint 层”分批进行，避免一次升级难以定位问题。
- 在升级 `eslint` 到 10 之前，先确认 `eslint-config-next` 及其插件链对 ESLint 10 的 peer 声明已稳定。
- 继续保留“升级后立即双应用 lint/build 回归”的流程作为标准操作。
