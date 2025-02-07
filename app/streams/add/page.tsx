"use client";

import FormBtn from "@/components/form-btn";
import FormInput from "@/components/form-input";
import { startStream } from "./actions";
import { useActionState } from "react";

export default function AddStream(){
  const [state, action] = useActionState(startStream, null);

  return(
    <form className="flex flex-col gap-6 py-10 px-6" action={action}>
      <FormInput errors={state?.formErrors}
      name="title" required placeholder="스트리밍 제목을 정해주세요."/>
      <FormBtn text="스트리밍 시작하기"/>
    </form>
  );
}