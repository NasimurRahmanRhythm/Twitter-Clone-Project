export {default} from 'next-auth/middleware'
export const config = { matcher: ["/home/:path*","/profile/:path*","/tweet/:path*","/message/:path*"] };
