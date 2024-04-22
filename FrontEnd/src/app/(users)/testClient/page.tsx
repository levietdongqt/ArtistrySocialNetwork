'use client'
import {testAPI} from "../../../services/main/auth-service";
import useSWR from "swr";
import {fetcherParams, fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";
import {getTest} from "../../../services/main/clientRequest/testClient";
import {getCookie} from "cookies-next";
import {useState} from "react";
import {toast} from "react-toastify";
import {useInfiniteScroll} from "@lib/hooks/useInfiniteScroll";
import {getPostsLimit} from "../../../services/realtime/clientRequest/postClient";
import {Button} from "antd";

export default function Page() {
    // const {data: data, isLoading: isLoading, error: error} = useSWR('/auth/hello2')
    const [call, setCall] = useState(false)
    const {data: data2, isLoading: isLoading2, error: error2} = useSWR(call? getTest(null) : null, fetcherWithToken)
    const test = () => {
        toast.success("Hello")
    }
    if(error2){
        return <div>Error: {error2.message}</div>
    }
    const { paginatedPosts:Data, isLoadingMore,LoadMore,isReachedEnd,setSize,size,mutate,error } =
        useInfiniteScroll(
            getPostsLimit,
        );
    return (
        <>
            <div>
                <Button onClick={() => setSize(size as number+ 1)}>tét</Button>
            </div>
        </>
    )
}