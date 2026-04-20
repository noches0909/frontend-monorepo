"use client";

import { Card, Divider, Typography } from "antd";

export function RoadmapPanel({ milestone, items, title = "版本路线" }) {
  return (
    <Card className="catalog-card" title={title}>
      <Typography.Paragraph>{milestone}</Typography.Paragraph>
      <Divider />
      <ul className="roadmap-panel__list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}
