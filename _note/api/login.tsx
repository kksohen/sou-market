"use client";

import FormBtn from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";

//API Route - 이전 방식이나 여전히 많이 사용 중이며 ios, android 백엔드앱 만들 때 필요ㅇ
export default function LogIn() {
const onClick= async()=>{
  const res = await fetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username: "sou",
      password: "1234"
    }),
  });
  console.log(await res.json());
};

return(
  <div className="flex flex-col gap-10 py-10 px-6">
    <div className="flex flex-col gap-2">
      <h1 className="text-4xl">Log into SOU</h1>
      <h2 className="text-xl text-base-300">소우 마켓에 돌아오셨군요!</h2>
    </div>
    
    <form className="flex flex-col gap-4">
      <FormInput required type="email" placeholder="이메일" errors={[]}/>
      <FormInput required type="password" placeholder="비밀번호" errors={[]}/>
      
    </form>

    <span onClick={onClick}>
      <FormBtn loading={false} text="로그인"/>
    </span>

    <SocialLogin/>
  </div>
);
};