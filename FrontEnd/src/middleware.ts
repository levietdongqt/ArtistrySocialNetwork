import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {jwtDecode, JwtPayload} from "jwt-decode";
import {getNewToken} from "./services/main/auth-service";
import {getCookie, setCookie} from "cookies-next";
import {deleteCookieTokenMiddleware, deleteCookieTokenSSR, resetCookieTokenSSR} from "@lib/helper/serverCookieHandle";
import {isTokenExpired} from "@lib/config/ServerHeaderConfig";


// This function can be marked `async` if using `await` inside
const middleware = async (request: NextRequest) => {
    console.log("middleware is running:  ", request.nextUrl.pathname);
    const isLoginOrRoot = ["/login", "/"].includes(request.nextUrl.pathname)
    // const isLogin = "/login" === request.nextUrl.pathname
    const response = NextResponse.next()
    const accessToken = getCookie('access_token', {cookies})?.toString();
    if (!accessToken) {
        console.log("ACCESS_TOKEN IS NOT FOUND")
        // if (isLogin) {
        //     return NextResponse.next();
        // }
        return redirectToLogin(request);
    }
    const payload = jwtDecode<JwtPayload>(accessToken)
    if (!isTokenExpired(payload)) {
        console.log("Request Valid: ", request.nextUrl.pathname)
        return ["/login", "/",].includes(request.nextUrl.pathname) ? redirectToHome(request) : response;
    }
    try {
        const result = await getNewToken();
        console.log(result.message)
        if (result && result.status === 200) {
            await resetCookieTokenSSR(result, request, response)
            return isLoginOrRoot ? redirectToHome(request) : response;
        }
        // return isLogin ? NextResponse.next() : redirectToLogin(request);
        return redirectToLogin(request);
    } catch (err) {
        console.log("ERROR: " + err)
        // return isLogin ? NextResponse.next() : redirectToLogin(request);
        return redirectToLogin(request);
    }
};

export {middleware};
export const config = {
    matcher: [
        '/home',
        '/',
        '/provider',
        '/message',
        '/profile/:path*',
        // '/login',
        '/profile/edit',
        // '/profile/create/main-services',
        '/notifications',
        // '/login',
        // '/testClient',
        "/testServer2",
        '/api/post:path*',
        '/api/user:path*'
    ]
}

function redirectToLogin(req: NextRequest) {
    // console.log("lot vao day khong ta");
    const loginUrl = new URL('/login', req.url);
    console.log("redirect To Login from: ", req.nextUrl.pathname)
    // Gửi thông tin trang trước thông qua query string
    const res = NextResponse.next({
        status: 307,//
        headers: {
            Location: loginUrl.toString(),
        },
    });
    deleteCookieTokenMiddleware(req, res);
    setCookie("prev_page", req.nextUrl.pathname, {res, req, maxAge: 60 * 10, path: "/"})
    return res;
}

function redirectToHome(req: NextRequest) {
    const homeUrl = new URL('/home', req.url);
    console.log("redirect To Home: ", req.nextUrl.pathname)
    return NextResponse.redirect(homeUrl)
}



