'use server'
import {MyResponse} from "@models/responseObject";
import {cookies} from "next/headers";
import {access_token_options, refresh_token_options} from "@lib/config/TokenConfig";
import {deleteCookie, getCookies, setCookie} from "cookies-next";
import {NextRequest, NextResponse} from "next/server";
import {AuthResponse} from "../../models/authResponse";

export async function setCookieTokenSSR(data: MyResponse<AuthResponse>) {
//     cookies().set("access_token", data.data.accessToken,access_token_options)
    console.log("SETTING COOKIE TOKEN")
    setCookie('access_token', data.data.accessToken, {cookies, ...access_token_options});
    setCookie('refresh_token', data.data.refreshToken, {cookies, ...refresh_token_options});
    setCookie('user', JSON.stringify(data.data.user), {cookies,...access_token_options});
    console.log("SET COOKIE SUCCESS")
}

export async function resetCookieTokenSSR(data: MyResponse<any>, req: NextRequest, res: NextResponse) {
//     cookies().set("access_token", data.data.accessToken,access_token_options)
    console.log("RESETTING COOKIE TOKEN")
    setCookie('access_token', data.data.accessToken, {req, res, ...access_token_options});
    setCookie('refresh_token', data.data.refreshToken, {req, res, ...refresh_token_options});
    console.log("RESET COOKIE SUCCESS")
}

export async function deleteCookieTokenSSR() {
//     cookies().set("access_token", data.data.accessToken,access_token_options)
    console.log("DELETING COOKIE TOKEN")
    deleteCookie('access_token', {cookies});
    deleteCookie('refresh_token', {cookies});
    deleteCookie('user', {cookies});
    console.log("DELETING COOKIE SUCCESS")
}

export async function deleteCookieTokenMiddleware(req: NextRequest, res: NextResponse) {
//     cookies().set("access_token", data.data.accessToken,access_token_options)
    console.log("DELETING COOKIE TOKEN")
    deleteCookie('access_token', {req, res});
    deleteCookie('refresh_token', {req, res});
    deleteCookie('user', {req, res});
    console.log("DELETING COOKIE SUCCESS")
}