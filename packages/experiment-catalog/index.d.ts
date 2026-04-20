export type ProductBlueprint = {
  name: string;
  versionLabel: string;
  summary: string;
  currentFocus: string;
  nextMilestone: string;
  principles: string[];
};

export type ProjectEntry = {
  id: string;
  packageName: string;
  title: string;
  stack: string;
  status: string;
  audience: string;
  summary: string;
  liveExperience: string;
  features: string[];
  nextStep: string;
};

export const productBlueprint: ProductBlueprint;
export const projectCatalog: ProjectEntry[];
