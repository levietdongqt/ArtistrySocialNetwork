"use client"
import {testAPI} from "../../../services/main/auth-service";
import useSWR from "swr";
import {fetcherParams, fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";
import {getTest} from "../../../services/main/clientRequest/testClient";

export default function Home() {
    // const {data: data, isLoading: isLoading, error: error} = useSWR('/auth/hello2')
    const {data: data2, isLoading: isLoading2, error: error2} = useSWR(getTest(null), fetcherWithToken)

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
        testAPI().then(value => {
            console.log("TEST FROM CLIENT");
        }).catch(reason => {
            console.log("ERROR FROM CLIENT");
            console.log(reason);
        }).finally(() => {
            console.log("FINALLY FROM CLIENT");
        })
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