'use client'
import {deleteCookie, getCookie, setCookie} from 'cookies-next';
import {AuthResponse} from "@models/authResponse";
import {access_token_options, refresh_token_options} from "@lib/config/TokenConfig";
import {MyResponse} from "@models/responseObject";


export async function setCookieHandler(props: AuthResponse) {
    setCookie("access_token", props?.accessToken, access_token_options)
    setCookie("refresh_token", props?.refreshToken,refresh_token_options)
    setCookie("user", props?.user,{path: "/"})
    console.log("SET COOKIE SUCCESS")
}

export async function resetCookieHandler(props: MyResponse<any>) {
    setCookie("access_token", props.data.accessToken, access_token_options)
    setCookie("refresh_token", props.data.refreshToken, refresh_token_options)
    console.log("SET COOKIE SUCCESS")
}
export async function deleteCookieHandler() {
    deleteCookie("access_token")
    deleteCookie("refresh_token")
    console.log("DELETE COOKIE SUCCESS")
}
