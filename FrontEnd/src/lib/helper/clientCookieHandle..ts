'use client'
import {deleteCookie, getCookie, setCookie} from 'cookies-next';
import {AuthResponse} from "@models/authResponse";


export function setCookieHandler (props : AuthResponse) {
    setCookie("access_token", props.accessToken)
    setCookie("refresh_token", props.refreshToken)
    setCookie("user", props.user)
    console.log("SET COOKIE SUCCESS")
}
