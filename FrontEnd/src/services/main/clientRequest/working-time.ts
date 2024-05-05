import axiosWithToken from "@lib/config/AxiosConfig";
import { fetcherParams } from "@lib/config/SwrFetcherConfig";
import { ServiceDestination } from "@lib/enum/ServiceDestination";
import { WorkingTime } from "@models/workingTime";
import { AxiosRequestConfig } from "axios";

export function getWorkingTimes (userId: string,status: boolean,expired: boolean): fetcherParams {
    return [`/working-time/${userId}/get-all-by-status?status=${status}&isExpired=${expired}`, 'GET',null, ServiceDestination.MAIN];
}

export function getAllWorkingTimes (userId: string): fetcherParams {
    return [`/working-time/${userId}/get-all`, 'GET',null, ServiceDestination.MAIN];
}

export async function createWorkingTime(userId : string,data: WorkingTime): Promise<any> {
    const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/working-time/${userId}/save`,
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

export async function updateWorkingTime(userId : string,data: WorkingTime): Promise<any> {
    const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/working-time/${userId}/update`,
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

export async function deleteWorkingTime(userId : string,workingTimeId: Number): Promise<any> {
    const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/working-time/${userId}/delete/${workingTimeId}`,
        method: "Delete",
        headers: {
            'Content-Type': 'application/json',
        },
    };

    try {
        const response = await axiosWithToken(config);
        return response.data.data;
    } catch (error) {
        console.error('Error deleted working time:', error);
        throw error;
    }
}

export async function reworkWorkingTime(userId : string,workingTimeId: Number): Promise<any> {
    const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/working-time/${userId}/rework/${workingTimeId}`,
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
    };

    try {
        const response = await axiosWithToken(config);
        return response.data.data;
    } catch (error) {
        console.error('Error rework working time:', error);
        throw error;
    }
}
