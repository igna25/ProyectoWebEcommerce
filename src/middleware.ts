
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req:any) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url));
  }
  if(pathname.startsWith('/admin') && !token ){
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if(pathname.startsWith('/admin') && token && token.role!='admin'){
    return NextResponse.redirect(new URL('/', req.url));
  }

  if(!pathname.startsWith('/admin') && token && token.role=='admin'){
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  if(pathname === '/buyProduct/buys' && !token){
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login','/','/admin/:path*','/buyProduct/:path*'],
};