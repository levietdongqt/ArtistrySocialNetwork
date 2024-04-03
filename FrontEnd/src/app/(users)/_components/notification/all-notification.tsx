import { Layout } from "antd";
import { UserCard } from "../user/user-card";
import { Typography } from "antd";
import NotificationCard from "./notification-card";
const { Sider, Content } = Layout;
const { Title } = Typography;

export default function AllNotification() {
    console.log('HELLO FROM NOTIFICATION');
  return (
    <Layout>
      <Content style={{ background: "#fff", padding: "20px" }}>
        <Title level={5} className="ml-1">
          Mới
        </Title>
        <NotificationCard addFriend={false}/>
        <NotificationCard addFriend={false}/>
      </Content>
      <Content style={{ background: "#fff", padding: "20px" }}>
        <Title level={5} className="ml-1">
          Trước đó
        </Title>
      </Content>
      <Content style={{ background: "#fff", padding: "20px" }}>
        <Title level={5} className="ml-1">
          Lời mời kết bạn
        </Title>
        <NotificationCard addFriend={true}/>
      </Content>
    </Layout>
  );
}
