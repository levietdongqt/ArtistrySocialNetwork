import axiosWithToken from "@lib/config/AxiosConfig";
import { fetcherParams } from "@lib/config/SwrFetcherConfig";
import { ServiceDestination } from "@lib/enum/ServiceDestination";
import { Promotion } from "@models/promotion";
import { AxiosRequestConfig } from "axios";


export function getPromotions (userId: string,status: boolean,expired: boolean): fetcherParams {
    return [`/promotions/${userId}/get-all-by-status?status=${status}&isExpired=${expired}`, 'GET',null, ServiceDestination.MAIN];
}

export function getAllPromotions (userId: string): fetcherParams {
    return [`/promotions/${userId}/get-all`, 'GET',null, ServiceDestination.MAIN];
}

export async function createPromotion(userId : string,data: Promotion): Promise<any> {
    const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/promotions/${userId}/save`,
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        data: data,
    };

    try {
        const response = await axiosWithToken(config);
        return response.data.data;
    } catch (error) {
        console.error('Error creating promotion:', error);
        throw error;
    }
}

export async function updatePromotion(userId : string,data: Promotion): Promise<any> {
    const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/promotions/${userId}/update`,
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        data: data,
    };

    try {
        const response = await axiosWithToken(config);
        return response.data.data;
    } catch (error) {
        console.error('Error updated promotion:', error);
        throw error;
    }
}
