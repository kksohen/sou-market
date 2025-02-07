import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session/get-session";

interface Routes {
  [key: string] : boolean;
}
const publicOnlyUrls : Routes = {
  "/": true,
  "/create-account": true,
  "/login": true,
  "/sms": true,
  "/github/start": true,
  "/github/complete": true,
  "/google/start": true,
  "/google/complete": true,
  "/kakao/start": true,
  "/kakao/complete": true,
  "/naver/start": true,
  "/naver/complete": true,
};
//middleware를 통한 user 제한ㅇ
export async function middleware(req: NextRequest){
  // console.log(req.nextUrl.pathname);
  //console.log(cookies());
const session = await getSession();
const exists = publicOnlyUrls[req.nextUrl.pathname];

if(!session.id){
 if(!exists){
  return NextResponse.redirect(new URL("/", req.url));
 }
}else{
  if(exists){
    return NextResponse.redirect(new URL("/home", req.url));
  }
 };
};

export const config = {
  /* matcher: ["/", "/profile", "/create-account", "/user/:path*"], middleware를 사용할 page들 */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] //api, _next/static, _next/image, favicon.ico를 제외한 모든 페이지에 middleware를 적용하겠다는 의미
};