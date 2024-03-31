import {cookies} from "next/headers";
import {ConTentType} from "@lib/enum/ConTentType";


export async function getServerSideHeaders(isAuth: boolean, contentType: ConTentType): Promise<Headers> {
    const headers = new Headers();
    headers.append('Content-Type', contentType.toString())
    if (!isAuth) {
        return headers;
    }
    const access_token = cookies().get('access_token')
    if (!access_token) {
        console.log("GET REQUEST HEADER FAILED")
        throw new Error("Access token is not found")
    }
    headers.set("Authorization", `Bearer ${access_token.value}`)
    console.log("Set Authorization header successfully")
    return headers;
}
