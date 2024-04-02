'use client'
import {testAPI} from "../../../services/main/auth-service";
import useSWR from "swr";
import {fetcherParams, fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";
import {getTest} from "../../../services/main/clientRequest/testClient";
import { getCookie, setCookie } from 'cookies-next'
export default function Home() {
    // const {data: data, isLoading: isLoading, error: error} = useSWR('/auth/hello2')
    const {data: data2, isLoading: isLoading2, error: error2} = useSWR(getTest(null), fetcherWithToken);

    var user = getCookie('user');
    console.log("test user: ", user);

    if (isLoading2) {
        return (
            <div>Loading...</div>
        )
    }
    if (error2) {
        return (
            <div>Error...</div>
        )
    }
    const test = () => {
        const user = getCookie('user');
        console.log("test user: ", user);
    }
    return (
        <>
            <div>
                <button type="button" onClick={test}>
                    CLICK HERE
                </button>
                {/*<div> {data?.hello}</div>*/}
                <br/>
                <div> {data2?.hello}</div>
            </div>
        </>
    )
}