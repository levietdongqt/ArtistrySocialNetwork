
import { getUserSearch } from "services/main/clientRequest/searchClient";
import { SearchUserCard } from "./search-user-card";
import useSWR from "swr";
import { useUser } from "context/user-context";
import { useSearch } from "context/search-context";
import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { Loading } from "@components/ui/loading";
import { AnimatePresence } from "framer-motion";
import { Error } from "@components/ui/error";
import { SearchServiceCard } from "./search-service-card";



export default function SearchUser() {
      const {currentUser} = useUser();
    const {searchText} = useSearch();
    const {
        data: data,
        isLoading: isLoading,
        error: error,
    } = useSWR(getUserSearch(currentUser?.id as string,searchText), fetcherWithToken);
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
                <SearchUserCard key={index} data={item}/>
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