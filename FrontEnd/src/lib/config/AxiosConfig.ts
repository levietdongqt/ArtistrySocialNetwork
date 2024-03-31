"use client"
import axios from "axios";
import {useRouter} from "next/navigation";
import {getCookie, setCookie} from "cookies-next";
import {jwtDecode, JwtPayload} from "jwt-decode";
import process from "process";
import {MyResponse} from "@models/responseObject";

const axiosWithToken = axios.create();
axiosWithToken.interceptors.request.use(async (config) => {
    var accessToken = getCookie("access_token")?.toString();
    const accessToken2 = getCookie("access_token2");
    console.log("Config axios - access_token: " + accessToken)
    if (!accessToken) {
        return config;
    }
    const payload = jwtDecode<JwtPayload>(accessToken)
    if (isTokenExpired(payload)) {
        const refresh_token = getCookie("refresh_token")?.toString();
        if (!refresh_token) {
            console.log("Config axios: invalid refresh token -> login")
            return config;
        }
        const authRepose = await getNewToken(refresh_token);
        if (authRepose.status !== 200) {
            console.log("Config axios: invalid response refresh token -> login")
            return config;
        }
        setCookie("access_token", authRepose.data.accessToken);
        accessToken = authRepose.data.accessToken;
    }
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});
export default axiosWithToken;

async function getNewToken(refreshToken: string): Promise<MyResponse<any>> {
    console.log("GET NEW TOKEN")
    const response = await axios.post(`${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/auth/refreshToken`, {
        token: refreshToken
    })
    const data: MyResponse<any> = response.data;
    console.log(data);
    return data
}

function isTokenExpired(payload: JwtPayload) {
    if (payload != undefined) {
        console.log("Expire token at: ", new Date(payload.exp!).toUTCString())
        const currentTime = Math.floor(Date.now() / 1000); // in seconds
        console.log("Curent time at: ", new Date(currentTime).toUTCString(), " -  ", new Date(currentTime))
        // @ts-ignore
        return currentTime > payload.exp;
    }
    return false;
    // Get the current Unix timestamp

}