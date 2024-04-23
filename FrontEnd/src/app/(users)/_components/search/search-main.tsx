import { Tabs } from "antd";

import SearchUser from "./search-user";
import SearchPost from "./search-post";
import SearchService from "./search-service";
import SearchAll from "./search-all";
import { useSearch } from "context/search-context";
import { useEffect } from "react";
const { TabPane } = Tabs;

const items = [
  {
    label: "Xu hướng",
    key: "all",
    children: <SearchAll/>, // Truyền component vào children
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
  const {topSearch} = useSearch();
  console.log("topSearch",topSearch)

  useEffect(()=>{

  },[topSearch])
  return (
    <>
  <Tabs className="flex flex-col h-full justify-center" defaultActiveKey={topSearch}>
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
