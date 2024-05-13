import {AxiosRequestConfig} from "axios";
import axiosWithToken from "@lib/config/AxiosConfig";
import {EditableMainServiceData, MainService} from "@models/main-service";
import {ExtraService} from "@models/extra-service";
import { fetcherParams } from "@lib/config/SwrFetcherConfig";
import { ServiceDestination } from "@lib/enum/ServiceDestination";





export async function createMainService(data: MainService): Promise<any> {
    const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/main-service/create`,
        method: "POST",
        headers: {
            'Content-Type': 'application/json', // Đặt Content-Type cho yêu cầu là JSON
        },
        data: data, // Gửi đối tượng data như là JSON; không cần JSON.stringify
    };

    try {
        const response = await axiosWithToken(config);
        return response.data.data; // Giả định rằng cấu trúc phản hồi có dạng { data: { data: ... } }
    } catch (error) {
        // Xử lý lỗi ở đây
        console.error('Error creating main service:', error);
        throw error; // Hoặc return thứ gì đó cho ngữ cảnh của bạn
    }
}
export async function updateMainService(data: EditableMainServiceData ): Promise<any> {
    const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/main-service/update`,
        method: "PUT",
        headers: {
            'Content-Type': 'application/json', // Đặt Content-Type cho yêu cầu là JSON
        },
        data: data, // Gửi đối tượng data như là JSON; không cần JSON.stringify
    };

    try {
        const response = await axiosWithToken(config);
        return response.data.data; // Giả định rằng cấu trúc phản hồi có dạng { data: { data: ... } }
    } catch (error) {
        // Xử lý lỗi ở đây
        console.error('Error creating main service:', error);
        throw error; // Hoặc return thứ gì đó cho ngữ cảnh của bạn
    }
}


export async function createExtraService(data: ExtraService): Promise<any> {
    const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/extra-service/create`,
        method: "POST",
        headers: {
            'Content-Type': 'application/json', // Đặt Content-Type cho yêu cầu là JSON
        },
        data: data, // Gửi đối tượng data như là JSON; không cần JSON.stringify
    };

    try {
        const response = await axiosWithToken(config);
        return response.data.data; // Giả định rằng cấu trúc phản hồi có dạng { data: { data: ... } }
    } catch (error) {
        // Xử lý lỗi ở đây
        console.error('Error creating main service:', error);
        throw error; // Hoặc return thứ gì đó cho ngữ cảnh của bạn
    }
}
export async function updateExtraService(data: ExtraService): Promise<any> {
    const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/extra-service/update`,
        method: "PUT",
        headers: {
            'Content-Type': 'application/json', // Đặt Content-Type cho yêu cầu là JSON
        },
        data: data, // Gửi đối tượng data như là JSON; không cần JSON.stringify
    };

    try {
        const response = await axiosWithToken(config);
        return response.data.data; // Giả định rằng cấu trúc phản hồi có dạng { data: { data: ... } }
    } catch (error) {
        // Xử lý lỗi ở đây
        console.error('Error creating main service:', error);
        throw error; // Hoặc return thứ gì đó cho ngữ cảnh của bạn
    }
}

export function GetMainServiceById (serviceId :number): fetcherParams {
    return [`/main-service/get/${serviceId}`, 'GET', null, ServiceDestination.MAIN];
}

export function GetAllMainService (userId :string): fetcherParams {
    return [`/main-service/get-all/${userId}`, 'GET', null, ServiceDestination.MAIN];
}

export function GetExtraServiceById (serviceId :number): fetcherParams {
    return [`/extra-service/get/${serviceId}`, 'GET', null, ServiceDestination.MAIN];
}

export function GetAllExtraService (userId :string): fetcherParams {
    return [`/extra-service/get/${userId}`, 'GET', null, ServiceDestination.MAIN];
}

export async function getExtraServiceByProvider (providerId :string){
    const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/extra-service/get-all/${providerId}`,
        method: "GET",
        headers: {
            'Content-Type': 'application/json', // Đặt Content-Type cho yêu cầu là JSON
        },
        data: null, // Gửi đối tượng data như là JSON; không cần JSON.stringify
    };

    try {
        const response = await axiosWithToken(config);
        return response.data; // Giả định rằng cấu trúc phản hồi có dạng { data: { data: ... } }
    } catch (error) {
        // Xử lý lỗi ở đây
        console.error('Error creating main service:', error);
        throw error; // Hoặc return thứ gì đó cho ngữ cảnh của bạn
    }
}