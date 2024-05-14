import {AxiosRequestConfig} from "axios";
import axiosWithToken from "@lib/config/AxiosConfig";
import {MainService} from "@models/main-service";
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
        console.error('Error creating main services:', error);
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
        console.error('Error creating main services:', error);
        throw error; // Hoặc return thứ gì đó cho ngữ cảnh của bạn
    }
}


export function GetAllMainService (userId :string): fetcherParams {
    return [`/main-service/get-all/${userId}`, 'GET', null, ServiceDestination.MAIN];
}

export function GetAllExtraService (userId :string): fetcherParams {
    return [`/extra-service/get-all/${userId}`, 'GET', null, ServiceDestination.MAIN];
}

export function GetAllSavedMainService (userId :string): fetcherParams {
    return [`/main-service/getAllSavedMainService/${userId}`, 'GET', null, ServiceDestination.MAIN];
}