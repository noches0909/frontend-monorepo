import { RoadmapPanel } from "@acme/ui";
import { productBlueprint } from "@acme/experiment-catalog";
import WorkbenchShell from "../components/workbench-shell";

export const metadata = {
  title: "版本路线",
  description: "Monorepo Lab 下一阶段路线"
};

export default function RoadmapPage() {
  return (
    <WorkbenchShell>
      <RoadmapPanel
        milestone={productBlueprint.nextMilestone}
        items={[
          "引入 Node.js 服务层，承接数据和动作。",
          "让实验页面从静态展示升级为真实业务流。",
          "继续保留实验控制台首页，让版本演进始终可见。"
        ]}
      />
    </WorkbenchShell>
  );
}
