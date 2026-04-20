import { ExperimentOverview } from "@acme/ui";
import { productBlueprint, projectCatalog } from "@acme/experiment-catalog";
import WorkbenchShell from "./components/workbench-shell";

export const metadata = {
  title: "实验总览",
  description: "Monorepo Lab 当前实验项目总览"
};

export default function Home() {
  return (
    <WorkbenchShell>
      <ExperimentOverview blueprint={productBlueprint} projects={projectCatalog} />
    </WorkbenchShell>
  );
}
