import { Loading } from "@components/ui/loading";
import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { useSearch } from "context/search-context";
import { getPostSearch } from "services/main/clientRequest/searchClient";
import useSWR from "swr";
import { Error } from "@components/ui/error";
import { AnimatePresence } from "framer-motion";
import {ContentPost} from "../content/content";
import { useEffect } from "react";


export default function SearchUser() {
  const {searchText,setDataUserSearch} = useSearch();
  const {
      data: data,
      isLoading: isLoading,
      error: error,
  } = useSWR(getPostSearch(searchText), fetcherWithToken);
  useEffect(() => {
    setDataUserSearch([data?.data]);
  },[data])
  return (
      <Layout>
    <Content style={{ background: "#fff", padding: "20px" }}>
      {isLoading ? (
        <Loading className="mt-5" />
      ) : !data.data ? (
        <Error message="Không tìm thấy kết quả" />
      ) : (
        <>
          <AnimatePresence mode="popLayout">
          {
            data.data.map((item: any, index : number) => {
              return (
                <ContentPost key={index} {...item}/>
              )
            })
          }
          </AnimatePresence>
          {/* <LoadMore />*/}
        </>
      )}
    </Content>
  </Layout>
  );
}