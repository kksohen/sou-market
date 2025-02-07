"use client";

import FormBtn from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import { createAccount } from "./actions";
import React, { useActionState, useState } from "react";
import { PASSWORD_MIN_LENGTH, USERNAME_MIN_LENGTH } from "@/lib/constants";

export default function CreateAccount() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [state, action] = useActionState(createAccount, null);

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
      <h1 className="text-4xl">Welcome</h1>
      <h2 className="text-xl text-base-300">회원가입을 위해 아래 빈칸을 채워주세요.</h2>
    </div>
    
    <form action={action}
    className="flex flex-col gap-4">
      <FormInput name="username" required type="text" placeholder="닉네임" errors={state?.fieldErrors.username}
      minLength={USERNAME_MIN_LENGTH}
      value={formData.username} onChange={handleChange}
      />
      <FormInput name="email" required type="email" placeholder="이메일" errors={state?.fieldErrors.email}
      value={formData.email} onChange={handleChange}
      />
      <FormInput name="password" required type="password" placeholder="비밀번호" errors={state?.fieldErrors.password}
      minLength={PASSWORD_MIN_LENGTH}
      value={formData.password} onChange={handleChange}
      />
      <FormInput name="confirm_password" required type="password" placeholder="비밀번호 확인" errors={state?.fieldErrors.confirm_password} 
      minLength={PASSWORD_MIN_LENGTH}
      value={formData.confirm_password} onChange={handleChange}
      />
      <FormBtn text="회원가입"/>
    </form>
    
    <SocialLogin/>
  </div>
);
};