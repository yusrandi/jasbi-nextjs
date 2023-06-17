
export { default } from 'next-auth/middleware'
export const config = {
    matcher: [
        "/",
        "/kategori/:path*",
        "/user/:path*",
        "/product/:path*",
        "/transaksi/:path*",
    ]
};