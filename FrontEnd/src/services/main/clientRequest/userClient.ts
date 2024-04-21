import {fetcherParams} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";
import {AxiosRequestConfig} from "axios";
import axiosWithToken from "@lib/config/AxiosConfig";


export function getUserById (userId: string): fetcherParams {
    return [`/user/get/${userId}`, 'GET', null, ServiceDestination.MAIN];
}

export async function updateUser(data: string): Promise<any> {
    const config: AxiosRequestConfig = {
        data: JSON.stringify(data),
        url: `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/auth/login`,
        method: "POST",
    };
    const response = await axiosWithToken(config);
    return response.data.data;
}
