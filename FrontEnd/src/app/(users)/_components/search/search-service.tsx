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
import { useEffect } from "react";
import { HeroIcon } from "@components/ui/hero-icon";
import { EmptyPage } from "@models/search";


export default function SearchService() {
  const {searchText,searchArrayServiceIds} = useSearch();
  const {
      data: data,
      isLoading: isLoading,
      error: error,
  } = useSWR(getServiceSearch(searchArrayServiceIds), fetcherWithToken);
  return (
      <Layout>
    <Content style={{ background: "#fff"}}>
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
          {
              data?.data.length === 0 &&
              <div className="text-center">
              <HeroIcon
              iconName="ShoppingBagIcon" className="mx-auto w-20"></HeroIcon>
              <p className="text-gray-500 text-lg">{EmptyPage.SERVICE}</p>
            </div>
            }
          </AnimatePresence>
          
        </>
      )}
    </Content>
  </Layout>
  );
}

