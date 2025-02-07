"use client";

import { PhotoIcon } from "@heroicons/react/24/solid";
import FormInput from "./form-input";
import FormBtn from "./form-btn";
import { getUploadUrl } from "@/app/home/add/actions";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { productSchema, ProductType } from "@/app/home/add/schema";
import { updateProduct } from "@/app/products/[id]/edit/actions";

interface IProductProps {
  product: ProductType;
  productId: number;
};

export default function UpdatePost({product, productId}: IProductProps) {
  const [uploadUrl, setUploadUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isFileModified, setIsFileModified] = useState(false);//파일 수정 여부 감지
  const { 
    register, 
    handleSubmit, 
    setValue, 
    formState:{errors}} = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });

  useEffect(()=>{ //product 변경될 때마다 form에 값 채워넣음(저장)
    setValue("title", product.title);
    setValue("price", product.price);
    setValue("description", product.description);
    setValue("photo", product.photo);

    if (product.photo) {
      setPreview(`${product.photo}/public`);
      // console.log(product.photo);
    }
  },[product, setValue]);

  const onImageChange = async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const {target: { files }} = e; 
    if(!files || files.length <= 0) return; //파일이 없으면 return
    const file = files[0];
    //user가 이미지 파일을 업로드했는지 확인
    const fileType = file.type;
    if(!fileType.includes("image")){ 
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

    const url = URL.createObjectURL(file); 
    setPreview(url);
    setFile(file);
    setIsFileModified(true);
    
    const {success, result} = await getUploadUrl();
    if(success){
      const {id, uploadURL} = result;
      setUploadUrl(uploadURL);
      setValue("photo", 
        `https://imagedelivery.net/SUpMJ-l_3UCdOiIbGD-vAA/${id}`);
    };
  };

  const onSubmit = handleSubmit(async (data: ProductType)=>{
    //수정하지 않고 제출 시
    if(!isFileModified && !file){
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("price", data.price + "");
      formData.append("description", data.description);
      formData.append("photo", data.photo);

      const errors = await updateProduct(productId, formData);
      if(errors){
        // setError();
      }
      return;
    }
    //수정하고 제출 시
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

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("price", data.price + "");
    formData.append("description", data.description);
    formData.append("photo", data.photo);

    const errors = await updateProduct(productId, formData);
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
              <span className="text-error">{errors.photo?.message}</span>
            </div>
          </>) : null}
        </label>
        <input type="file" id="photo" name="photo" accept="image/*"
        className="hidden" onChange={onImageChange}
        />{/* input - label htmlFor 트릭 */}

        <FormInput required placeholder="제목" type="text" 
        errors={[errors.title?.message ?? ""]}
        {...register("title")}
        ></FormInput>
        <FormInput required placeholder="가격" type="number"
        errors={[errors.price?.message ?? ""]} 
        {...register("price")}
        ></FormInput>
        <FormInput type="text" required placeholder="설명"
        errors={[errors.description?.message ?? ""]}
        {...register("description")}
        ></FormInput>
        <FormBtn text="쏙 업로드" />

      </form>
    </div>
  );
};