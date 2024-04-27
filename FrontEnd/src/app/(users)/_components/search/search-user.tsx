
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
import { useEffect } from "react";
import { HeroIcon } from "@components/ui/hero-icon";
import { EmptyPage } from "@models/search";


export default function SearchUser() {
      const {currentUser} = useUser();

    const {searchText,searchArrayUserIds} = useSearch();
    const {
        data: data,
        isLoading: isLoading,
        error: error,
    } = useSWR(getUserSearch(currentUser?.id as string,searchArrayUserIds.filter((id:string) => id !== currentUser?.id))  , fetcherWithToken);
    return (
        <Layout>
      <Content style={{ background: "#fff"}}>
        {isLoading ? (
          <Loading className="mt-5" />
        ) : !data.data ? (
          <Error message="Không tìm thấy kết quả" />
        ) : (
          <div>
            <AnimatePresence mode="popLayout">
              {
            data?.data.map((item: any, index : number) => {
              return (
                <div className="mt-3">
                <SearchUserCard key={index} data={item}/>
                </div>
              )
            })
            }
            {
              data?.data.length === 0 &&
              <div className="text-center">
              <HeroIcon
              iconName="UsersIcon" className="mx-auto w-20"></HeroIcon>
              <p className="text-gray-500 text-lg">{EmptyPage.USER}</p>
            </div>
            }
            </AnimatePresence>
          </div>
        )}
      </Content>
    </Layout>
    );
}