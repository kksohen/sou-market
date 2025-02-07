"use client";

import FormInput from "./form-input";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { postSchema, PostType } from "@/app/(tabs)/life/add/schema";
import { updatePostAction } from "@/app/posts/[id]/edit/actions";
import { useFormStatus } from "react-dom";

interface IPostProps {
  post: PostType;
  postId: number;
};

export default function EditPost({post, postId}: IPostProps) {
  const {pending} = useFormStatus();

  const [isFileModified, setIsFileModified] = useState(false);//파일 수정 여부 감지
  const { 
    register, 
    handleSubmit, 
    setValue, 
    setError, 
    formState:{errors}} = useForm<PostType>({
    resolver: zodResolver(postSchema),
  });

  useEffect(()=>{ //변경될 때마다 form에 값 채워넣음(저장)
    setValue("title", post.title);
    setValue("description", post.description ?? "");

  },[post, setValue]);

  const onSubmit = handleSubmit(async (data: PostType)=>{
    //수정하지 않고 제출 시
    if(!isFileModified){
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);

      const errors = await updatePostAction(postId, formData);
      if(errors){
        // setError();
      }
      return;
    }
    //수정하고 제출 시
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);

    const errors = await updatePostAction(postId, formData);
    if(errors){
      // setError();
      // console.log(errors);
    }
  });

  const onValid = async () => {
    await onSubmit();
  };

  return(
    <div>
      <form action={onValid}
        className="flex flex-col gap-4 py-10 px-6">
  
          <FormInput required placeholder="제목" type="text" 
          errors={[errors.title?.message ?? ""]} 
          {...register("title")}
          ></FormInput>
  
          <textarea placeholder="무슨 일이 일어나고 있나요?" required
          {...register("description")} rows={8} 
          className="w-full
          bg-transparent rounded-lg resize-none
          focus:outline-none border-none ring-1 ring-neutral-600 transition
          focus:ring-2 focus:ring-primary"
          ></textarea>
          {errors.description && (<span className="font-medium text-error text-sm">{errors.description.message}</span>)}
  
          <div className="mt-2">
          <button type="submit"
            disabled={pending}
            className="primary-btn py-2.5 disabled:bg-neutral-600 disabled:cursor-not-allowed">{pending ? "로딩 중..." : "쏙 업로드"}</button>
          </div>
  
        </form>
    </div>
  );
};