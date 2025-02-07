"use client";

import FormBtn from "@/components/form-btn";
import FormInput from "@/components/form-input";
import { useActionState } from "react";
import { smsLogin } from "./actions";

const initialState = {
  token: false,
  error: undefined,
  phone: ""
};

//dynamic form - 문자 인증
export default function SMSLogin() {
  const [state, action] = useActionState(smsLogin, initialState);

return(
  <div className="flex flex-col gap-10 py-10 px-6">
    <div className="flex flex-col gap-2">
      <h1 className="text-4xl">SMS Login</h1>
      <h2 className="text-xl text-base-300">휴대폰을 통한 인증이 필요해요.</h2>
    </div>
    
    <form action={action}
    className="flex flex-col gap-4">
      {state.token ? <FormInput name="token"
      required type="number" placeholder="인증번호" 
      min={100000} max={999999}
      errors={state.error?.formErrors}
      /> : <FormInput 
      name="phone"
      required type="text" placeholder="전화번호" 
      errors={state.error?.formErrors}
      />}
      <FormBtn text={state.token ? "인증하기" : "인증번호 발송하기"}/>
    </form>
    
  </div>
);
};