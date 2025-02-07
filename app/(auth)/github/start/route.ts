import { redirect } from "next/navigation";

//url의 특정 http method handler
export function GET(){
  // console.log("GET");
  const baseURL = "https://github.com/login/oauth/authorize";
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: "read:user, user:email",
    allow_signup: "false", //기본값 true: github에 가입되어있지 않은 사용자도 가입할 수 있게ㅇ
  };
  const formattedParams = new URLSearchParams(params).toString();
  // console.log(formattedParams.toString());
  const finalURL = `${baseURL}?${formattedParams}`;
  return redirect(finalURL);
};