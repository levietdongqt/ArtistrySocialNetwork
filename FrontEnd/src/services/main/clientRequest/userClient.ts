import {fetcherParams} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";
import {AxiosRequestConfig} from "axios";
import axiosWithToken from "@lib/config/AxiosConfig";
import {ExtraService} from "@models/extra-service";
import {Review} from "@models/review";


export function getUserById(userId: string): fetcherParams {
    return [`/user/get/${userId}`, 'GET', null, ServiceDestination.MAIN];
}

export async function updateUser(data: any): Promise<any> {
    const config: AxiosRequestConfig = {
        data: JSON.stringify(data),
        url: `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/user/update`,
        method: "POST",
    };
    const response = await axiosWithToken(config);
    return response.data;
}

export function getAllReviewsByUserId(userId: string): fetcherParams {
    return [`/review/get-all/${userId}`, 'GET', null, ServiceDestination.MAIN];
}


export async function createReview(data: Review): Promise<any> {
    const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/review/create`,
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
        console.error('Error creating review:', error);
        throw error; // Hoặc return thứ gì đó cho ngữ cảnh của bạn
    }
}


