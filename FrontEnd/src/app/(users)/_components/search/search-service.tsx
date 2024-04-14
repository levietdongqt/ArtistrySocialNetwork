import { Loading } from "@components/ui/loading";
import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { useSearch } from "context/search-context";
import { getPostSearch, getServiceSearch } from "services/main/clientRequest/searchClient";
import useSWR from "swr";
import { Error } from "@components/ui/error";
import { AnimatePresence } from "framer-motion";
import { SearchServiceCard } from "./search-service-card";


export default function SearchService() {
  const {searchText} = useSearch();
  const {
      data: data,
      isLoading: isLoading,
      error: error,
  } = useSWR(getServiceSearch(searchText), fetcherWithToken);
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
                <SearchServiceCard key={index} data={item}/>
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

