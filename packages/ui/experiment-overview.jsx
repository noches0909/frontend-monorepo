"use client";

import { Card, Col, Row, Space, Tag, Typography } from "antd";

export function ExperimentOverview({ blueprint, projects }) {
  return (
    <Space orientation="vertical" size={24} className="experiment-overview">
      <section className="experiment-overview__hero">
        <span className="experiment-overview__eyebrow">{blueprint.versionLabel}</span>
        <Typography.Title level={1}>{blueprint.name}</Typography.Title>
        <Typography.Paragraph>{blueprint.summary}</Typography.Paragraph>
        <Typography.Paragraph>{blueprint.currentFocus}</Typography.Paragraph>
        <div className="experiment-overview__tags">
          {blueprint.principles.map((principle) => (
            <Tag key={principle} color="blue">
              {principle}
            </Tag>
          ))}
        </div>
      </section>

      <Row gutter={[16, 16]}>
        {projects.map((project) => (
          <Col xs={24} lg={12} key={project.id}>
            <Card className="experiment-overview__card" title={project.title}>
              <Space orientation="vertical" size={12} className="experiment-overview__stack">
                <Space wrap>
                  <Tag color="geekblue">{project.packageName}</Tag>
                  <Tag color="green">{project.status}</Tag>
                </Space>
                <Typography.Paragraph>{project.summary}</Typography.Paragraph>
                <Typography.Text type="secondary">{project.stack}</Typography.Text>
                <ul className="experiment-overview__list">
                  {project.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Space>
  );
}
