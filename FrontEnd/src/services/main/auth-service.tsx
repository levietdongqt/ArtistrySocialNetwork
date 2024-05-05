'use server'
import {cookies, headers} from "next/headers";
import {MyResponse} from "@models/responseObject";
import process from "process";
import {ConTentType} from "@lib/enum/ConTentType";
import {User} from "../../models/user";
import {AuthResponse} from "@models/authResponse";
import {getServerSideHeaders} from "@lib/config/ServerHeaderConfig";
import {setCookieTokenSSR} from "@lib/helper/serverCookieHandle";
import {getCookie} from "cookies-next";

function delay(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
    });
}

export async function loginService(values: any): Promise<MyResponse<AuthResponse>> {
    console.log("Voo ", values)
    // console.log(headers)
    const res = await fetch(`${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/auth/login`,
        {
            body: JSON.stringify(values),
            method: 'POST',
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json"
            },
        })
    const data: MyResponse<AuthResponse> = await res.json();
    console.log(data)
    if (res.ok) {
        setCookieTokenSSR(data);
        return data;
    } else if (data.status === 401) {
        return data;
    } else {
        console.log(data.message)
        throw new Error("Server error: " + res.statusText)
    }
}

export async function registerService(values: any): Promise<MyResponse<AuthResponse>> {
    try {
        console.log("Voo ", values)
        // console.log(headers)
        const res = await fetch(`${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/auth/register`,
            {
                body: JSON.stringify(values),
                method: 'POST',
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json"
                },
            })
        const data: MyResponse<AuthResponse> = await res.json();
        console.log(data)
        if (res.ok) {
            // setCookieTokenSSR(data);
            return data;
        } else {
            console.log(data.message)
            throw new Error("Server error: " + res.statusText)
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function verifyPhoneNumber(phoneNumber: string): Promise<boolean> {
    try {// console.log(headers)
        const res = await fetch(`${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/auth/verify/${phoneNumber}`,
            {
                body: null,
                method: 'POST',
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json"
                },
            })
        const data: any = await res.json();
        console.log('verifyPhoneNumber',data)
        if (res.ok) {
            return data.data;
        } else {
            console.log(data.message)
            throw new Error("Server error: " + res.statusText)
        }
    } catch (error) {
        console.log('verifyPhoneNumber',error)
        throw error
    }
}

export async function changePassword(values: any): Promise<boolean> {
    try {// console.log(headers)
        const res = await fetch(`${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/auth/change-password`,
            {
                body: JSON.stringify(values),
                method: 'POST',
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json"
                },
            })
        const data: any = await res.json();
        console.log(data)
        if (res.ok) {
            return data.data;
        } else {
            console.log(data.message)
            throw new Error("Server error: " + res.statusText)
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function isExistAccount(phoneNumber: string): Promise<boolean> {
    try {// console.log(headers)
        const res = await fetch(`${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/auth/check-exist/${phoneNumber}`,
            {
                body: null,
                method: 'POST',
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json"
                },
            })
        const data: any = await res.json();
        console.log(data)
        if (res.ok) {
            return data.data;
        } else {
            console.log(data.message)
            throw new Error("Server error: " + res.statusText)
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function oauth2Service(token: string): Promise<MyResponse<AuthResponse>> {
    try {
        // console.log(headers)
        const res = await fetch(`${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/auth/register/oauth2`,
            {
                body: JSON.stringify({"token": token}),
                method: 'POST',
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json"
                },
            })
        const data: MyResponse<AuthResponse> = await res.json();
        console.log(data.message)
        if (res.ok) {
            setCookieTokenSSR(data);
            return data;
        } else {
            console.log(data.message)
            throw new Error("Server error: " + res.statusText)
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function testAPI(): Promise<any> {
    console.log("Testing........")
    try {
        // console.log(headers)
        const res = await fetch(`${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/auth/hello`,
            {
                method: 'GET',
                headers: await getServerSideHeaders(true, ConTentType.JSON),
                cache: "no-cache"
            })

        if (res.ok) {
            const data = await res.json();
            console.log(data)
            return data;
        } else {
            console.log("SAI ROI", res.statusText, res.status)
            return null;
        }
    } catch (error) {
        console.log(error)
    }
}

export async function testHeader(): Promise<any> {
    "use server"
    try {
        console.log("TEST headers........")
        console.log("FROM TEST: ", cookies().get("refresh_token"))
        // console.log(headers)
        const headersList = headers()
        console.log("Author: ", headersList.get("Author"))
        console.log("Content-Type: ", headersList.get("Content-Type"))
    } catch (error) {
        console.log("ERROR ", error)
    }
}

// export async function getNewToken(refresh_token: string): Promise<MyResponse<any>> {
//     try {
//         console.log("GET NEW TOKEN...................");
//         const value = await fetch(`${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/auth/refreshToken`, {
//             body: JSON.stringify({"token": refresh_token}),
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         })
//         return await value.json();
//     } catch (error) {
//         console.log(error)
//         throw new Error("Something went wrong in server action")
//     }
// }

export async function getNewToken(): Promise<MyResponse<any>> {
    try {
        const refreshToken = getCookie("refresh_token", {cookies})?.toString();
        if (!refreshToken) {
            throw new Error("Refresh token is not found")
        }
        console.log("GET NEW TOKEN ....... ", refreshToken);
        const response = await fetch(`${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/auth/refreshToken`, {
            body: JSON.stringify({"token": refreshToken}),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return await response.json();
    } catch (error) {
        console.log(error)
        throw error;
    }
}

function setCookieToken(data: MyResponse<any>) {
    const expireAccessToken = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes in milliseconds
    const expireRefreshToken = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 day in milliseconds
    cookies().set("access_token", data.data.accessToken, {
        secure: true,
        httpOnly: true,
        expires: expireAccessToken,
    })
    cookies().set('refresh_token', data.data.refreshToken, {
        secure: true,
        httpOnly: true,
        expires: expireRefreshToken,
    });
    cookies().set('cookieTest1', data.data.refreshToken, {
        secure: true,
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 1000),
    });
    cookies().set('user', data.data.user, {
        secure: true,
        httpOnly: true,
        expires: expireRefreshToken,
    });
}
