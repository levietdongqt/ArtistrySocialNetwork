import {cookies} from "next/headers";
import {ConTentType} from "@lib/enum/ConTentType";
import {getCookie} from "cookies-next";
import {jwtDecode, JwtPayload} from "jwt-decode";
import {getNewToken} from "../../services/main/auth-service";
import {setCookieHandler} from "@lib/helper/clientCookieHandle";
import {resetCookieTokenSSR, setCookieTokenSSR} from "@lib/helper/serverCookieHandle";


export async function getServerSideHeaders(isAuth: boolean, contentType: ConTentType): Promise<Headers> {
    const headers = new Headers();
    headers.append('Content-Type', contentType.toString())
    if (!isAuth) {
        return headers;
    }
    var accessToken = getCookie("access_token", {cookies})?.toString();
    console.log("getServerSideHeaders - access_token: " + accessToken)
    if (!accessToken) {
        console.log("GET REQUEST HEADER FAILED")
        throw new Error("Access token is not found")
    }
    const payload = jwtDecode<JwtPayload>(accessToken)
    if (isTokenExpired(payload)) {
        const refreshResponse = await getNewToken();
        console.log(refreshResponse.message)
        if (refreshResponse && refreshResponse.status === 200) {
            await setCookieTokenSSR(refreshResponse)
            accessToken = refreshResponse.data.accessToken
        } else {
            console.log(refreshResponse.message)
            throw new Error("Refresh token is not valid")
        }
    }
    console.log("Token before: ", getCookie("access_token", {cookies})?.toString())
    headers.set("Authorization", `Bearer ${accessToken}`)
    console.log("Set Authorization header successfully")
    return headers;
}
export function isTokenExpired(payload: JwtPayload) {
    if (payload != undefined) {
        const currentTime = Math.floor(Date.now() / 1000); // in seconds
        // @ts-ignore
        return currentTime > payload.exp;
    }
    return false;
    // Get the current Unix timestamp

}
