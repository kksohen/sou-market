import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  /* output: "export",
  basePath: "/sou-market", */
  experimental:{
    taint: true, //security 기능(server측 코드를 클라이언트에서 볼 수 없도록 막아줌)
  }
  ,
  logging: {
    fetches: {
      fullUrl: true, //외부 api 호출시 hit, skip 여부 상세보기
    }
  }
  ,
  images: {
    /* unoptimized: true, */
    remotePatterns: [
      {
        /* protocol: "http", */
        hostname: "k.kakaocdn.net", //kakao
        /* port: "",
        pathname: "/**", */
      },
      {
        hostname: "ssl.pstatic.net", //naver
      },
      {
        hostname: "lh3.googleusercontent.com", //google
      },
      {
        hostname: "avatars.githubusercontent.com", //github
      },
      {
        hostname: "imagedelivery.net", //cloudflare
      },
      {
        hostname: "customer-5qdr6f1ldn8re1s1.cloudflarestream.com", //cloudflare stream
      },
    ],
  }
};

export default nextConfig;
