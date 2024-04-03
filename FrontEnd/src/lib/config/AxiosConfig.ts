"use client"
import axios from "axios";
import {getCookie, setCookie} from "cookies-next";
import {getNewToken} from "../../services/main/auth-service";
import {resetCookieHandler} from "@lib/helper/clientCookieHandle";

const axiosWithToken = axios.create();
axiosWithToken.interceptors.request.use(
    async config => {
        var accessToken = getCookie("access_token")?.toString();
        console.log("Config axios - access_token: " + accessToken)
        if (!accessToken) {
            throw new Error("Access token not provided")
        }
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
    },
)
axiosWithToken.interceptors.response.use(
    async response => {
        return response;
    },
    async error => {
        try {
            const originalRequest = error.config;
            console.log("SOME ERROR IN AXIOS CONFIG", error)
            if (error.response?.status === 401 && !originalRequest?._retry) {
                console.log("GETTING NEW ACCESS_TOKEN")
                // Xác định là yêu cầu đã thử lại để tránh vòng lặp vô tận
                originalRequest._retry = true
                // Gửi yêu cầu để lấy accessToken mới sử dụng refreshToken
                const authRepose = await getNewToken();
                if (authRepose.status !== 200) {
                    console.log("Config axios: invalid response refresh token -> login")
                    return Promise.reject(error);
                }
                resetCookieHandler(authRepose)
                axiosWithToken.defaults.headers.common['Authorization'] = 'Bearer ' + authRepose.data.accessToken;
                // Gửi lại request gốc với accessToken mới
                return axiosWithToken(originalRequest);

            }
            return Promise.reject(error);
        } catch (error) {
            // Nếu có lỗi thì xử lý, ví dụ: đăng xuất, hiển thị thông báo,...
            return Promise.reject(error);
        }
    }
)
export default axiosWithToken;