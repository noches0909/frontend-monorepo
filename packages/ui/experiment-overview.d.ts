import type { ProductBlueprint, ProjectEntry } from "@acme/experiment-catalog";

export type ExperimentOverviewProps = {
  blueprint: ProductBlueprint;
  projects: ProjectEntry[];
};

export declare function ExperimentOverview(
  props: ExperimentOverviewProps
): import("react").JSX.Element;
