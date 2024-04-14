import { Tabs } from "antd";

import SearchUser from "./search-user";
import SearchPost from "./search-post";
import SearchService from "./search-service";
const { TabPane } = Tabs;

const items = [
  {
    label: "Tất Cả",
    key: "all",
    children: <div>Tất cả nè</div>, // Truyền component vào children
  },
  {
    label: "Người dùng",
    key: "user",
    children: <SearchUser />, // Truyền component vào children
  },
  {
    label: "Dịch vụ",
    key: "service",
    children: <SearchService />, // Truyền component vào children
  },
  {
    label: "Bài đăng",
    key: "post",
    children: <SearchPost />, // Truyền component vào children
  },
];

export default function SearchMain() {
  return (
    <>
  <Tabs className="flex flex-col h-full justify-center">
    {items.map((item) => (
      <TabPane
        key={item.key}
        tab={
          <div className="ml-10 mr-10">
            <div className="font-bold">{item.label}</div>
          </div>
        }
      >
        {item.children}
      </TabPane>
    ))}
  </Tabs>
</>
  );
}
