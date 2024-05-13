/** @models {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    i18n: {
        locales: ['en', 'vi'],
        defaultLocale: 'en'
    },
    images: {
        domains: ['cdn.wallpapersafari.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cgodev.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'graph.facebook.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.youtube.com',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'example.com',
                pathname: '/**',
            }
        ],
    },
}

module.exports = nextConfig

