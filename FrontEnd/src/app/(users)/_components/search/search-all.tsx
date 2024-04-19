import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import { useSearch } from "context/search-context";
import { AnimatePresence } from "framer-motion";
import { SearchUserCard } from "./search-user-card";
import { ContentPost } from "../content/content";
import SearchUser from "./search-user";
import SearchPost from "./search-post";
import SearchService from "./search-service";
import { fetcherWithToken } from "@lib/config/SwrFetcherConfig";
import { useUser } from "context/user-context";
import { getUserSearch } from "services/main/clientRequest/searchClient";
import useSWR from "swr";


export default function SearchAll() {


    return (
        <>
        <Content style={{background: "#fff", padding: "20px"}}>
            <Title level={5} className="ml-1">
                Bạn bè đang tìm kiếm
            </Title>
            <>
                <AnimatePresence mode="popLayout">
                    
                </AnimatePresence>
                {/* <LoadMore />*/}
            </>
        </Content>

        <Content style={{background: "#fff", padding: "20px"}}>
            <Title level={5} className="ml-1">
                Bài viết có liên quan
            </Title>
            <>
                <AnimatePresence mode="popLayout">
                </AnimatePresence>
                {/* <LoadMore />*/}
            </>
        </Content>
        <Content style={{background: "#fff", padding: "20px"}}>
            <Title level={5} className="ml-1">
               Dịch vụ đang tìm kiếm
            </Title>
            <>
                <AnimatePresence mode="popLayout">
                </AnimatePresence>
                {/* <LoadMore />*/}
            </>
        </Content>
    </>
    )
}