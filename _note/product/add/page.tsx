"use client";

import FormBtn from "@/components/form-btn";
import FormInput from "@/components/form-input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import React, { useActionState, useState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";

export default function AddProducts(){

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
  });

  const [photoId, setPhotoId] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [preview, setPreview] = useState("");
  const onImageChange = async(e:React.ChangeEvent<HTMLInputElement>)=>{//이미지 변경시 미리보기 기능
    //console.log(e.target.files);
    const {target: { files }} = e; //const {files} = e.target;와 같음
    // if(!files) return;
    if(!files || files.length <= 0) return; //파일이 없으면 return
    const file = files[0];
    //user가 이미지 파일을 업로드했는지 확인
    const fileType = file.type;
    if(!fileType.includes("image")){ //!fileType.startsWith("image/")도 가능ㅇ
      alert("jpg, jpeg, png 형식의 이미지 파일만 업로드 가능합니다.");
      return;
    }
    //사진 크기 4mb 제한
    const fileSizeMB = 4;
    const fileSizeBytes = fileSizeMB * 1024 * 1024;
    if(file.size > fileSizeBytes){
      alert(`${fileSizeMB}MB 이하의 이미지 파일을 업로드해주세요.`);
      return;
    }

    const url = URL.createObjectURL(file); //url 생성해줌
    // console.log(url);
    setPreview(url);

    //1.user가 img를 업로드하려고 하면 cloudflare에 업로드할 수 있는 url을 받아옴
    const {success, result} = await getUploadUrl();
    /* console.log(res); //img의 id, uploadURL 얻을 수 있음 */
    if(success){
      const {id, uploadURL} = result;
      setUploadUrl(uploadURL);
      setPhotoId(id);
    };
  };

  const interceptAction = async(_:any, formData: FormData)=>{
    //1.upload img to cloudflare
    const file = formData.get("photo");
    if(!file){
      alert("제품이 잘 드러나는 사진을 추가해주세요.");
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
    //2.formData의 photo 교체
    const photoUrl = `https://imagedelivery.net/SUpMJ-l_3UCdOiIbGD-vAA/${photoId}`;
    formData.set("photo", photoUrl);
    //3.uploadProduct 호출
    return uploadProduct(_, formData);
  };
  const [state, action] = useActionState(interceptAction, null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const {name, value} = e.target;
    setFormData((prevData)=>({
      ...prevData,
      [name]: value,
    }));
  };

  return(
    <div>
      <form action={action} 
      className="flex flex-col gap-4 py-10 px-6">

        <label htmlFor="photo" 
        style={{backgroundImage: `url(${preview})`}}
        className="bg-center bg-cover
        cursor-pointer border-2 aspect-square rounded-lg border-neutral-600 border-dashed
        flex flex-col items-center justify-center
        text-neutral-600 hover:border-primary  transition-colors
        *:hover:text-primary *:transition-colors 
        ">
          {preview === "" ? (<>
            <PhotoIcon className="w-20 "></PhotoIcon>
            <div className="text-neutral-500 flex flex-col items-center">
              <span>+ 사진을 추가해주세요 +</span>
              <span className="text-error">{state?.fieldErrors.photo}</span>
            </div>
          </>) : null}
        </label>
        <input type="file" id="photo" name="photo" accept="image/*"
        className="hidden" onChange={onImageChange}
        />{/* input - label htmlFor 트릭 */}

        <FormInput required placeholder="제목" type="text" name="title"
        errors={state?.fieldErrors.title} 
        value={formData.title} onChange={handleChange}
        ></FormInput>
        <FormInput required placeholder="가격" type="number" name="price"
        errors={state?.fieldErrors.price}
        value={formData.price} onChange={handleChange}
        ></FormInput>
        <FormInput type="text" required placeholder="설명" name="description"
        errors={state?.fieldErrors.description}
        value={formData.description} /* onChange={handleChange} */
        ></FormInput>
        <FormBtn text="쏙 업로드"/>

      </form>
    </div>
  );
}