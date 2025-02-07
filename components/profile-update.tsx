"use client";

import { PhotoIcon } from "@heroicons/react/24/solid";
import FormBtn from "./form-btn";
import FormInput from "./form-input";
import React, { useEffect, useState } from "react";
import { PASSWORD_MIN_LENGTH, USERNAME_MIN_LENGTH } from "@/lib/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUploadUrl } from "@/app/home/add/actions";
import { profileSchema, ProfileType } from "@/app/(tabs)/profile/[id]/edit/schema";
import { updateProfile } from "@/app/(tabs)/profile/[id]/actions";

interface IProfileProps {
  user: ProfileType;
  userId: number;
}

export default function UpdateProfile({user, userId}: IProfileProps){
  const [uploadUrl, setUploadUrl] = useState("");
    const [preview, setPreview] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isFileModified, setIsFileModified] = useState(false);
    const { 
      register, 
      handleSubmit, 
      setValue, 
      formState:{errors}} = useForm<ProfileType>({
      resolver: zodResolver(profileSchema),
    });
  
    useEffect(()=>{

      setValue("username", user.username);
      setValue("email", user.email || "");
      setValue("phone", user.phone || "");
      setValue("avatar", user.avatar || "");
      setValue("password", user.password || "");
      setValue("confirm_password", user.confirm_password || "");
  
      if (user.avatar) {
        setPreview(`${user.avatar}`);
      }
    },[user, setValue]);
  
    const onImageChange = async(e:React.ChangeEvent<HTMLInputElement>)=>{
      const {target: { files }} = e; 
      if(!files || files.length <= 0) return;

      const file = files[0];
      const fileType = file.type;
      if(!fileType.includes("image")){ 
        alert("jpg, jpeg, png 형식의 이미지 파일만 업로드 가능합니다.");
        return;
      }
      const fileSizeMB = 4;
      const fileSizeBytes = fileSizeMB * 1024 * 1024;
      if(file.size > fileSizeBytes){
        alert(`${fileSizeMB}MB 이하의 이미지 파일을 업로드해주세요.`);
        return;
      }
  
      const url = URL.createObjectURL(file); 
      setPreview(url);
      setFile(file);
      setIsFileModified(true);
      
      const {success, result} = await getUploadUrl();
      if(success){
        const {id, uploadURL} = result;
        setUploadUrl(uploadURL);
        setValue("avatar", 
        `https://imagedelivery.net/SUpMJ-l_3UCdOiIbGD-vAA/${id}`);
      };
    };
  
    const onSubmit = handleSubmit(async (data: ProfileType) => {
      
      if(!isFileModified && !file){
        const formData = new FormData();
        formData.append("username", data.username);
        formData.append("email", data.email || "");
        formData.append("phone", data.phone || "");
        formData.append("avatar", data.avatar || "");
        formData.append("password", data.password || "");
        formData.append("confirm_password", data.confirm_password || "");
  
        const errors = await updateProfile(userId, formData);
        if(errors){}
        return;
      }
      
      if(!file){
        alert("프로필 이미지를 추가해주세요.");
        return;
      };
      const cloudflareForm = new FormData();
      cloudflareForm.append("file", file);
      const res = await fetch(uploadUrl, {
        method: "POST",
        body: cloudflareForm,
      });
      if(res.status !== 200){
        alert("사진 업로드에 실패했습니다.");
        return;
      }
  
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email || "");
      formData.append("phone", data.phone || "");
      formData.append("avatar", data.avatar || "");
      formData.append("password", data.password || "");
      formData.append("confirm_password", data.confirm_password || "");
  
      const errors = await updateProfile(userId, formData);
      if(errors){}
    });
  
    const onValid = async () => {
      await onSubmit();
    };
    const handleFormSubmit = handleSubmit(onValid);

  return(
    <div>
      <form onSubmit={handleFormSubmit}
      className="flex flex-col gap-4 p-6">

        <div className="flex flex-col items-center gap-3">
          <label htmlFor="avatar" 
          style={{backgroundImage: `url(${preview})`}}
          className="flex flex-col items-center justify-center
          bg-center bg-cover cursor-pointer size-28 rounded-full 
          border-2 border-neutral-600 border-dashed text-neutral-600 hover:border-primary transition-colors
          *:hover:text-primary *:transition-colors">
            {preview === ""? (
            <>
            <div>
              <PhotoIcon className="w-20"/>
            </div>
            <span className="text-error">{errors.avatar?.message}</span>
            </>
          ) : null}
          </label>
        </div>
        <input type="file" id="avatar" name="avatar" accept="image/*"
        className="hidden" onChange={onImageChange}/>

        <FormInput required type="text" placeholder="닉네임" 
        minLength={USERNAME_MIN_LENGTH}
        errors={[errors.username?.message ?? ""]}
        {...register("username")}
        />
        <FormInput type="email" placeholder="이메일" 
        errors={[errors.email?.message ?? ""]}
        {...register("email")}
        />
        <FormInput type="text" placeholder="전화번호" 
        errors={[errors.phone?.message ?? ""]}
        {...register("phone")}
        />
        <FormInput type="password" placeholder="비밀번호" 
        minLength={PASSWORD_MIN_LENGTH}
        errors={[errors.password?.message ?? ""]}
        {...register("password")}
        />
        <FormInput type="password" placeholder="비밀번호 확인" 
        minLength={PASSWORD_MIN_LENGTH}
        errors={[errors.confirm_password?.message ?? ""]}
        {...register("confirm_password")}
        />

        <FormBtn text="프로필 업데이트"/>
      </form>
    </div>
  );
}