"use client";

import FormBtn from "@/components/form-btn";
import FormInput from "@/components/form-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, PostType } from "./schema";
import { uploadPost } from "./actions";

export default function AddPosts(){
  
  const { register, handleSubmit, formState:{errors}} = useForm<PostType>({
    resolver: zodResolver(postSchema),
  });

  const onSubmit = handleSubmit(async (data: PostType)=>{

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description); 

    const errors = await uploadPost(formData);
      if(errors){
        // setError();
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
          <FormBtn text="쏙 업로드" />
        </div>

      </form>
    </div>
  );
}