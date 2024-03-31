import { Layout } from "antd";
import NotificationCard from "./notification-card";
const { Sider, Content } = Layout;

export default function UnreadNotification() {
    return (
        <Layout>
        <Content style={{ background: "#fff", padding: "20px" }}>
          <NotificationCard addFriend={true}/>
          <NotificationCard addFriend={true}/>
        </Content>
        </Layout>
    );
  }