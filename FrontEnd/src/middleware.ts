import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {jwtDecode, JwtPayload} from "jwt-decode";
import process from "process";
import {getNewToken} from "./services/main/auth-service";
import {getCookie, setCookie} from "cookies-next";
import {resetCookieTokenSSR} from "@lib/helper/serverCookieHandle";
import {access_token_options} from "@lib/config/TokenConfig";
import {isTokenExpired} from "@lib/config/ServerHeaderConfig";


// This function can be marked `async` if using `await` inside
const middleware = async (request: NextRequest) => {
    console.log("middleware is running...... + " + Math.floor(Math.random() * 100));
    const response = NextResponse.next()
    const accessToken = getCookie('access_token', {cookies})?.toString();
    console.log(`Access token: ${(accessToken)}`);
    if (!accessToken) {
        console.log("ACCESS_TOKEN IS NOT FOUND")
        return redirectToLogin(request);
    }
    const payload = jwtDecode<JwtPayload>(accessToken)
    if (!isTokenExpired(payload)) {
        return response;
    }
    try {
        const result = await getNewToken();
        console.log(result.message)
        if (result && result.status === 200) {
            await resetCookieTokenSSR(result, request, response)
            return response;
        }
        return redirectToLogin(request);
    } catch (err) {
        console.log("ERROR: " + err)
        return redirectToLogin(request);
    }
};

export {middleware};
export const config = {
    matcher: [
        '/home',
        // '/testClient',
        "/testServer2",
        '/api/post:path*',
        '/api/user:path*'
    ]
}

function redirectToLogin(req: NextRequest) {
    const loginUrl = new URL('/login', req.url);
    // Gửi thông tin trang trước thông qua query string
    const res = NextResponse.next({
        status: 301,// Mã trạng thái chuyển hướng vĩnh viễn
        headers: {
            Location: loginUrl.toString(),
        },
    });
    console.log("In Redirect: ", req.nextUrl.pathname)
    setCookie("prev_page", req.nextUrl.pathname, {res, req, maxAge: 60 * 10, path: "/login"})
    return res;
}



