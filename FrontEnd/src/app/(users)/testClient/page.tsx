'use client'
import {testAPI} from "../../../services/main/auth-service";
import useSWR from "swr";
import {fetcherParams, fetcherWithToken} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";
import {getTest} from "../../../services/main/clientRequest/testClient";
import {getCookie} from "cookies-next";
import {useState} from "react";

export default function Page() {
    // const {data: data, isLoading: isLoading, error: error} = useSWR('/auth/hello2')
    const [call, setCall] = useState(false)
    const {data: data2, isLoading: isLoading2, error: error2} = useSWR(call? getTest(null) : null, fetcherWithToken)
    const test = () => {
        console.log("User", getCookie('user'));
        setCall(true)
    }
    if(error2){
        return <div>Error: {error2.message}</div>
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