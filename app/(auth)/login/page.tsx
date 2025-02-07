"use client";

import FormBtn from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import { login } from "./actions";
import React, { useActionState, useState } from "react"; //useFormState에서 useActionState로 변경됨;
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

//server actions
export default function LogIn() {
  const [formData, setFormData] = useState({
      email: '',
      password: '',
  });
  
  const [state, action] = useActionState(login, null);
  /* useFormStatus : form 전송 상태 알려주는 react-hook. 로딩 중으로 버튼 이중클릭 막기. 
  form의 자식태그에서만 사용가능(FormBtn에서 사용해야ㅇ) 
  const {pending} = useFormStatus(); */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
      const {name, value} = e.target;
      setFormData((prevData)=>({
        ...prevData,
        [name]: value,
      }));
    };
    
return(
  <div className="flex flex-col gap-10 py-10 px-6">
    <div className="flex flex-col gap-2">
      <h1 className="text-4xl">Log into SOK</h1>
      <h2 className="text-xl text-base-300">마켓에 돌아오셨군요!</h2>
    </div>
    
    <form action={action} 
    className="flex flex-col gap-4">
      <FormInput name="email"required type="email" placeholder="이메일" 
      errors={state?.fieldErrors.email}
      value={formData.email} onChange={handleChange}
      />
      <FormInput name="password" required type="password" placeholder="비밀번호" 
      minLength={PASSWORD_MIN_LENGTH}
      errors={state?.fieldErrors.password}
      value={formData.password} onChange={handleChange}
      />
      <FormBtn text="로그인"/>
    </form>
    
    <SocialLogin/>
  </div>
);
};