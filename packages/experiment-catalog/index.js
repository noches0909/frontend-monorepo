export const productBlueprint = {
  name: "Monorepo Lab",
  versionLabel: "当前实验版本",
  summary:
    "一个面向产品闭环演进的实验仓库，用来先验证前端交互、页面表达和模块组织方式。",
  currentFocus:
    "把不同功能先做成可切换的实验页面，明确每个项目当前验证的方向，并保持统一的导航入口。",
  nextMilestone:
    "下个版本会引入 Node.js 服务层，把现有实验页面接成真正可流转的产品闭环。",
  principles: [
    "每个 app 都应该是有明确目的的实验，而不是一次性的临时页面。",
    "首页承担实验控制台角色，既能切换页面，也能说明当前在验证什么。",
    "稳定的知识应该沉淀到共享包里，比如 UI 基础能力和实验目录数据。"
  ]
};

export const projectCatalog = [
  {
    id: "next-app",
    packageName: "@acme/next-app",
    title: "Next 落地页实验",
    stack: "Next.js 16 / App Router / TypeScript",
    status: "进行中",
    audience: "品牌表达与产品叙事方向探索",
    summary:
      "一个双语落地页实验，用来验证信息层次、视觉氛围和轻量状态持久化。",
    liveExperience:
      "支持中英文切换、Cookie 记忆语言状态，以及完整的营销型落地页流程。",
    features: [
      "支持 zh-CN 与 en-US 的语言切换和状态记忆",
      "包含 Hero、数据指标、功能介绍、流程说明和 CTA 区块",
      "适合产品首页实验的品牌化视觉表达"
    ],
    nextStep:
      "等后端和内容链路接入后，把当前静态 CTA 变成真实的业务流程。"
  },
  {
    id: "react-app",
    packageName: "@acme/react-app",
    title: "React 模型对比实验",
    stack: "React 19 / Vite / TypeScript",
    status: "进行中",
    audience: "对比式交互与多媒体展示方向探索",
    summary:
      "一个卡片式模型对比实验，用来并排展示不同模型结果和多媒体内容。",
    liveExperience:
      "支持视频与图片卡片并排展示，保留简单的决策按钮和响应式布局。",
    features: [
      "同时支持视频和图片结果展示",
      "可复用的比较卡片结构与基础入场动效",
      "适合后续评测工作流扩展的紧凑展示样式"
    ],
    nextStep:
      "等 Node.js 服务层接入后，连接真实推理结果和反馈动作。"
  }
];
