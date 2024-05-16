import {fetcherParams} from "@lib/config/SwrFetcherConfig";
import {ServiceDestination} from "@lib/enum/ServiceDestination";
import {AxiosRequestConfig} from "axios";
import axiosWithToken from "@lib/config/AxiosConfig";
import {ExtraService} from "@models/extra-service";
import {Review} from "@models/review";
import process from "process";
import {ChangePassDTO} from "@models/user";


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

export async function changePasswordUser(values: ChangePassDTO): Promise<boolean> {
    // Cấu hình request bằng Axios
    const config = {
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/user/change-password`,
        data: values,
        headers: {
            "Content-Type": "application/json"
            // Lưu ý: Không cần thêm "Authorization" ở đây
            // vì nó sẽ được thêm tự động bởi hàm axiosWithToken
        }
    };

    try {
        // Gửi request với token thông qua hàm axiosWithToken
        const response = await axiosWithToken(config);

        // Kiểm tra phản hồi và trả về boolean tương ứng
        if (response && response.status === 200) {
            return true;
        } else {
            console.error('Failed to change password:', response.data.message);
            return false;
        }
    } catch (error) {
        console.error('Error while changing password:', error);
        throw error;
    }
}
