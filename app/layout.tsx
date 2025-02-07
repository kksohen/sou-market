import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Rubik_Puddles } from "next/font/google";

//page, error, notfound(404), loading, route.tsx들은 고유네임
//(folder)는 url에 방해가지 않고 무시됨(폴더 정리에 유용)
//_folder는 완전 private 폴더로 화면에 노출 자체가 ㄴ
//@folder는 복사하는 개념(모달창 만들 때 유용)

//google font
const RubikPuddles = Rubik_Puddles({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--font-rubik-text",
});

//local font
const pretendard = localFont({
  src: "../fonts/PretendardGOVVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: {
    template: "%s | SOK Market",
    default: "SOK Market"
  },
  description: "Sell or buy anything you want!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // console.log(RubikPuddles, pretendard);

  return (
    <html lang="ko" data-theme="cmyk">
      <body
        className={`${pretendard.variable} ${RubikPuddles.variable} font-pretendard max-w-screen-sm mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}