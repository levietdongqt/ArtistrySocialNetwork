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
import { HeroIcon } from "@components/ui/hero-icon";
import { EmptyPage } from "@models/search";


export default function SearchUser() {
  const {searchText,searchArrayPostIds} = useSearch();
  const {
      data: data,
      isLoading: isLoading,
      error: error,
  } = useSWR(getPostSearch(searchArrayPostIds), fetcherWithToken);
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
                <ContentPost key={index} {...item}/>
              )
            })
          }
          {
              data?.data.length === 0 &&
              <div className="text-center">
                <HeroIcon
                iconName="DocumentIcon" className="mx-auto w-20"></HeroIcon>
                <p className="text-gray-500 text-lg">{EmptyPage.POST}</p>
              </div>
            }
          </AnimatePresence>
        </>
      )}
    </Content>
  </Layout>
  );
}