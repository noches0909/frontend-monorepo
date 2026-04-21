# monorepo-lab

前端多应用 Monorepo，使用 `pnpm workspaces` 统一管理应用与共享包。当前包含：

- `apps/next-app`：Next.js App Router 应用
- `apps/react-app`：Vite + React 应用
- `packages/ui`：跨应用复用的 UI 组件与样式
- `packages/experiment-catalog`：实验/模型展示数据与类型

## 快速开始

```bash
pnpm install
pnpm dev:next
```

常用命令：

```bash
pnpm dev:next
pnpm dev:react
pnpm lint
pnpm build
pnpm start
```

按应用执行命令：

```bash
pnpm --filter @acme/next-app dev
pnpm --filter @acme/react-app dev
```

## 协作约定

仓库提交“团队需要一致的配置”，不提交“个人账号、本地路径、缓存、生成状态”。这样可以让协作者复现项目，又避免把某个人机器上的状态扩散到所有人。

建议提交：

- `package.json`、`pnpm-lock.yaml`、`pnpm-workspace.yaml`
- `tsconfig.json`、`eslint.config.*`、`next.config.js`、`vite.config.js`
- `vercel.json`
- `.env.example` 或 README 中的环境变量说明
- 共享组件、共享样式、项目文档

不建议提交：

- `.claude/`：本地 AI 工具配置、权限偏好或机器相关状态
- `.vercel/`：Vercel 本地链接、账号/项目绑定、拉取到本机的环境变量
- `node_modules/`、`.next/`、`dist/`、缓存目录
- `.env*.local`、密钥、个人 token

如果某个本地目录已经被 Git 跟踪，加入 `.gitignore` 后还需要从索引移除一次：

```bash
git rm --cached <path>
```

例如：

```bash
git rm --cached .claude/settings.local.json
```

## 项目文档

完整项目说明、工作区结构、配置边界、依赖维护记录与兼容性修复清单见：

- [PROJECT.md](./PROJECT.md)
