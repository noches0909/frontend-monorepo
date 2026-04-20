"use client";

import { Menu, Typography } from "antd";

export function ExperimentWorkbench({
  eyebrow = "实验工作台",
  title,
  description,
  currentPath,
  menuItems,
  children
}) {
  return (
    <div className="workbench-shell">
      <aside className="workbench-sidebar">
        <div className="workbench-sidebar__intro">
          <Typography.Text className="workbench-sidebar__eyebrow">
            {eyebrow}
          </Typography.Text>
          <Typography.Title level={3}>{title}</Typography.Title>
          <Typography.Paragraph>{description}</Typography.Paragraph>
        </div>
        <Menu mode="inline" selectedKeys={[currentPath]} items={menuItems} />
      </aside>

      <main className="workbench-main">{children}</main>
    </div>
  );
}
