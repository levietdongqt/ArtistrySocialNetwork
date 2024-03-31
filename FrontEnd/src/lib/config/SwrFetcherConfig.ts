"use client"

import axios, {AxiosRequestConfig, Method} from 'axios';
import process from "process";
import axiosWithToken from "@lib/config/AxiosConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";
// Ví dụ: Một function để lấy token từ localStorage hoặc từ Context,
// nơi bạn lưu trữ authentication token của người dùng
// const getToken = () => 'your_token_here';

export async function fetchJSON(
    resource: string,
): Promise<any> {
    try {
        const fullUrl = `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}${resource}`
        console.log("Fetching JSON FROM Default SWR: ", fullUrl)
        const response = await axios.get(fullUrl);
        console.log("SWR", response)
        return response.data;
    } catch (e) {
        console.log(e)
        throw e;
    }
}

export type fetcherParams = [url: string,mrthod:  Method | 'GET', body:  any | null,destination: ServiceDestination];

export async function fetcherWithToken(params: any): Promise<any> {
    const [ url, method, body, destination ] = params;
    console.log("Fetcher with token -  destination: ",destination)

    try {
        var fullUrl = "";
        if (destination === ServiceDestination.REALTIME) {
            fullUrl = fullUrl.concat(`${process.env.NEXT_PUBLIC_REALTIME_SERVICE_URL}`).concat(url);
        }
        if (destination === ServiceDestination.MAIN) {
            fullUrl = fullUrl.concat(`${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}`).concat(url);
        }
        console.log("Fetching JSON FROM SWR token: ", fullUrl)
        const config : AxiosRequestConfig  = {
            data: body,
            url: fullUrl,
            method: method,
        };
        const response = await axiosWithToken(config);
        return response.data;
        // Xử lý response tại đây
    } catch (error) {
        console.log(error)
        throw error
    }
};

