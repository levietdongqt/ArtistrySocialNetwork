'use client'
import {deleteCookie, getCookie, setCookie} from 'cookies-next';
import {AuthResponse} from "@models/authResponse";

export function setCookieHandler (props : AuthResponse) {
    console.log("SETTING COOKIE ", props)
    setCookie("access_token", props.accessToken)
    setCookie("refresh_token", props.refreshToken)
    setCookie('users', props.user)
    console.log("SET COOKIE SUCCESS")
}
