import type { MenuProps } from "antd";
import type { ReactNode } from "react";

export type ExperimentWorkbenchProps = {
  eyebrow?: string;
  title: ReactNode;
  description: ReactNode;
  currentPath: string;
  menuItems: MenuProps["items"];
  children: ReactNode;
};

export declare function ExperimentWorkbench(
  props: ExperimentWorkbenchProps
): import("react").JSX.Element;
