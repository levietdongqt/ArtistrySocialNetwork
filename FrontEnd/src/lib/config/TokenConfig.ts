const tokenAge = 2 * 24 * 60 * 60 * 1000 // 2 day in milliseconds
export const refresh_token_options = {
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true,
    maxAge: tokenAge,
    path: "/"
    // domain: `${process.env.NEXT_PUBLIC_CLIENT_URL}`
};
export const access_token_options = {
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: false,
    maxAge: tokenAge,
    path: "/"
    // domain: `${process.env.NEXT_PUBLIC_CLIENT_URL}`
};