import { Col, Row } from "antd";
import { Typography } from "antd";
import { HeroIcon } from "@components/ui/hero-icon";
const { Title } = Typography;

export default function NotificationHeader() {
  return (
    <Row className="flex justify-between mt-3 font-semibold">
      <Col span={8}>
        <Title level={3} className="ml-4">
          Thông báo
        </Title>
      </Col>
      <Col span={8}>
        <div className="flex justify-end mr-4">
          <HeroIcon iconName="Cog8ToothIcon" />
        </div>
      </Col>
    </Row>
  );
}
