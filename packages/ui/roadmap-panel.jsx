"use client";

import { Card, Divider, List, Typography } from "antd";

export function RoadmapPanel({ milestone, items, title = "版本路线" }) {
  return (
    <Card className="catalog-card" title={title}>
      <Typography.Paragraph>{milestone}</Typography.Paragraph>
      <Divider />
      <List
        dataSource={items}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </Card>
  );
}
