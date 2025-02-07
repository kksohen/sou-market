"use server";

import "server-only";
//npm i server-only : 서버에서만 사용되는 코드파일 전체를 클라이언트에서 사용할 수 없게 만들어줌ㅇ

export function fetchFromAPI(){
  fetch(".....");
}