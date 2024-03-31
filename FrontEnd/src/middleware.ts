import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {jwtDecode, JwtPayload} from "jwt-decode";
import {redirect} from "next/navigation";
import process from "process";
import {MyResponse} from "@models/responseObject";
import {RequestCookies} from "next/dist/compiled/@edge-runtime/cookies";
import {refreshTokenHandler} from "./services/main/auth-service";


// This function can be marked `async` if using `await` inside
const middleware = async (request: NextRequest) => {
    console.log("middleware is running...... + " + Math.floor(Math.random() * 100));
    console.log("ENVIRONMENT: ",process.env.NEXT_PUBLIC_MAIN_SERVICE_URL)
    const requestHeaders = new Headers();
    const access_token_cookie = cookies().get("access_token");
    var accessToken = access_token_cookie?.value;
    if (!accessToken) {
        console.log("ACCESS_TOKEN IS NOT FOUND")
        return redirectToLogin(request);
    }
    const payload = jwtDecode<JwtPayload>(accessToken)
    if (isTokenExpired(payload)) {
        const refresh_token = cookies().get("refresh_token");
        if (!refresh_token) {
            console.log("REFRESH_TOKEN IS IS NOT FOUND")
            return redirectToLogin(request);
        }
        try {
            const result = await refreshTokenHandler(refresh_token.value)
            console.log(result.message)
            if (result && result.status === 200) {
                accessToken = result.data.accessToken
            } else {

                return redirectToLogin(request);
            }
        } catch (err) {
            console.log("ERROR: " + err)
        }
    }
    requestHeaders.append('Authorization', `Bearer ${accessToken}`);
    requestHeaders.append("Author", "LE VIET DONG");
    const nextResponse = NextResponse.next(
        {headers: requestHeaders}
    )
    nextResponse.cookies.set("access_token", accessToken!)
    // nextResponse.headers.set("Author", "LE VIET DONG");
    // nextResponse.headers.set("Author", "LE VIET DONG 2");
    // nextResponse.headers.set('Content-Type', 'application/json')
    // nextResponse.headers.set('Authorization', `Bearer ${access_token!.value}`);
    // return nextResponse;
    return nextResponse;
};

export {middleware};
export const config = {
    matcher: [
        // '/login',
        '/',
        // '/testClient',
        "/testServer",
        '/api/post:path*',
        '/api/user:path*'
    ]
}

function redirectToLogin(request: NextRequest) {
    console.log("redirecting to login")
    // const url = request.nextUrl.clone()
    // url.href = url.origin + "/login"
    // url.pathname = '/login'
    return NextResponse.redirect(new URL('/login', request.url))
}

function isTokenExpired(payload: JwtPayload) {
    if (payload != undefined) {
        const currentTime = Math.floor(Date.now() / 1000); // in seconds
        // @ts-ignore
        return currentTime > payload.exp;
    }
    return false;
    // Get the current Unix timestamp

}

