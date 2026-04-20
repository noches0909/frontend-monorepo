import type { MenuProps } from "@acme/ui";
import {
  Card,
  ExperimentOverview,
  ExperimentWorkbench,
  RoadmapPanel,
  Space,
  Typography
} from "@acme/ui";
import { productBlueprint, projectCatalog } from "@acme/experiment-catalog";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import ModelComparison from "./components/ModelComparison";
import SliderCaptchaComparisonPage from "./components/slider-captcha-comparison/SliderCaptchaComparisonPage";
import "./App.css";

const menuItems = [
  { key: "/", label: <Link to="/">实验总览</Link> },
  { key: "/model-comparison", label: <Link to="/model-comparison">模型对比实验</Link> },
  {
    key: "/slider-captcha-comparison",
    label: <Link to="/slider-captcha-comparison">滑动验证码对比实验</Link>
  },
  { key: "/roadmap", label: <Link to="/roadmap">版本路线</Link> }
] satisfies MenuProps["items"];

function OverviewPage() {
  return <ExperimentOverview blueprint={productBlueprint} projects={projectCatalog} />;
}

function ModelComparisonPage() {
  const reactProject = projectCatalog.find((project) => project.id === "react-app");

  if (!reactProject) {
    return null;
  }

  return (
    <Space orientation="vertical" size={24} className="panel-stack">
      <Card className="catalog-card">
        <Space orientation="vertical" size={8} className="panel-stack">
          <Typography.Title level={2}>{reactProject.title}</Typography.Title>
          <Typography.Paragraph>{reactProject.liveExperience}</Typography.Paragraph>
          <Typography.Text type="secondary">{reactProject.nextStep}</Typography.Text>
        </Space>
      </Card>
      <ModelComparison />
    </Space>
  );
}

function RoadmapPage() {
  return (
    <RoadmapPanel
      milestone={productBlueprint.nextMilestone}
      items={[
        "引入 Node.js 服务层，承接真实数据、状态和操作结果。",
        "让两个前端实验接入共享 API，而不是只展示静态页面。",
        "继续保留实验控制台首页，让版本演进始终可见。"
      ]}
    />
  );
}

function AppFrame() {
  const location = useLocation();

  return (
    <ExperimentWorkbench
      title="React 实验入口"
      description="每个菜单都是独立页面，切换时地址会同步变化，方便继续扩展成完整产品。"
      currentPath={location.pathname}
      menuItems={menuItems}
    >
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/model-comparison" element={<ModelComparisonPage />} />
          <Route
            path="/slider-captcha-comparison"
            element={<SliderCaptchaComparisonPage />}
          />
          <Route path="/roadmap" element={<RoadmapPage />} />
        </Routes>
    </ExperimentWorkbench>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppFrame />
    </BrowserRouter>
  );
}
