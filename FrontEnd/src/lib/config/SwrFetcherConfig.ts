"use client"

import axios, {AxiosRequestConfig, Method} from 'axios';
import process from "process";
import axiosWithToken from "@lib/config/AxiosConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";
// Ví dụ: Một function để lấy token từ localStorage hoặc từ Context,
// nơi bạn lưu trữ authentication token của người dùng
// const getToken = () => 'your_token_here';

export async function fetchJSON(
    params: any
): Promise<any> {
    try {
        const [url, method, body, destination] = params;
        console.log("Fetcher No token -  destination: ", destination)
        var fullUrl = "";
        if (destination === ServiceDestination.REALTIME) {
            fullUrl = fullUrl.concat(`${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}`).concat(url);
        }
        else if (destination === ServiceDestination.MAIN) {
            fullUrl = fullUrl.concat(`${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}`).concat(url);
        }else{
            throw new Error("Invalid services destination!!")
        }
        const response = await axios.get(fullUrl);
        console.log("SWR url", fullUrl)

        console.log("SWR response", response)
        return response.data;
    } catch (e) {
        console.log(params,e)
        throw e;
    }
}

export type fetcherParams = [url: string, method: Method | 'GET', body: any | null, destination: ServiceDestination];

export async function fetcherWithToken(params: any, arg?:any): Promise<any> {
    const [url, method, body, destination] = params;
    try {
        var fullUrl = "";
        if (destination === ServiceDestination.REALTIME) {
            fullUrl = fullUrl.concat(`${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}`).concat(url);
        }
        if (destination === ServiceDestination.MAIN) {
            fullUrl = fullUrl.concat(`${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}`).concat(url);
        }
        const config: AxiosRequestConfig = {
            data: body || arg,
            url: fullUrl,
            method: method,
        };
        const response = await axiosWithToken(config);
        console.log("SWR response", response)
        return response.data;
        // Xử lý response tại đây
    } catch (error) {
        console.log(error)
        throw error
    }
};

