'use server'
import {cookies, headers} from "next/headers";
import {MyResponse} from "@models/responseObject";
import process from "process";
import {ConTentType} from "@lib/enum/ConTentType";
import {User} from "../../models/user";
import {AuthResponse} from "@models/authResponse";
import {getServerSideHeaders} from "@lib/config/ServerHeaderConfig";

function delay(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
    });
}

export async function loginService(values: any): Promise<MyResponse<AuthResponse>> {
    try {
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
        console.log(data.message)
        if (res.ok) {
            setCookieToken(data);
            return data;
        } else {
            console.log(data.message)
            throw new Error("Something went wrong in login server action")
        }
    } catch (error) {
        console.log(error)
        throw new Error("Something went wrong in login server action")
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
            setCookieToken(data);
            return data;
        } else {
            console.log(data.message)
            throw new Error("Something went wrong in login server action")
        }
    } catch (error) {
        console.log(error)
        throw new Error("Something went wrong in login server action")
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
            const data = await res.text();
            console.log(data)
            return data;
        } else {

            console.log("SAI ROI")
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

export async function refreshTokenHandler(refresh_token: string): Promise<MyResponse<any>> {
    try {
        console.log("GET NEW TOKEN...................");
        const value = await fetch(`${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/auth/refreshToken`, {
            body: JSON.stringify({"token": refresh_token}),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return await value.json();
    } catch (error) {
        console.log(error)
        throw new Error("Something went wrong in server action")
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
}
