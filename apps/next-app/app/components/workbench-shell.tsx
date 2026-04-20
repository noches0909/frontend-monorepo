"use client";

import type { ReactNode } from "react";
import { ExperimentWorkbench } from "@acme/ui";
import type { MenuProps } from "@acme/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

type WorkbenchShellProps = {
  children: ReactNode;
};

const menuItems = [
  { key: "/", label: <Link href="/">实验总览</Link> },
  { key: "/landing-lab", label: <Link href="/landing-lab">落地页实验</Link> },
  { key: "/roadmap", label: <Link href="/roadmap">版本路线</Link> }
] satisfies MenuProps["items"];

export default function WorkbenchShell({ children }: WorkbenchShellProps) {
  const pathname = usePathname();

  return (
    <ExperimentWorkbench
      title="Next 实验入口"
      description="首页、落地页实验和版本路线都是独立页面，切换时 URL 会同步变化。"
      currentPath={pathname}
      menuItems={menuItems}
    >
      {children}
    </ExperimentWorkbench>
  );
}
