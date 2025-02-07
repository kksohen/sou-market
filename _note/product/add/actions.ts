"use server";

// import fs from "fs/promises";
import db from "@/lib/db";
import getSession from "@/lib/session/get-session";
import { redirect } from "next/navigation";
import { PRODUCT_MAX_LENGTH_ERROR, PRODUCT_MIN_LENGTH_ERROR } from "@/lib/constants";
import { z } from "zod";

const imageExtensions = ["jpg", "jpeg", "png"];
const productSchema = z.object({
  photo: z.string({
    required_error: "제품이 잘 드러나는 사진을 추가해주세요.",
  }).refine((value)=>{
    const extension = value.split(".").pop()?.toLowerCase();
    return extension && imageExtensions.includes(extension);
  }, {message: "jpg, jpeg, png 형식의 이미지 파일만 업로드 가능합니다."}),
  title: z.string({
    required_error: "제목을 기입해주세요.",
  }).max(15, PRODUCT_MAX_LENGTH_ERROR),
  price: z.coerce.number({//form에서 받아오는 값은 모두 string이므로 coerce 사용해 number로 변환시켜줌
    required_error: "가격을 입력해주세요.",
  }),
  description: z.string({
    required_error: "제품에 대한 자세한 설명을 적어주세요.",
  }).min(20, PRODUCT_MIN_LENGTH_ERROR),
});

export async function uploadProduct(_: any, formData: FormData){
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  /* if(data.photo instanceof File){ //연습용으로만 사용가능ㅇ(파일 저장하는 거라)
    const photoData  = await data.photo.arrayBuffer();
    await fs.appendFile(`./public/${data.photo.name}`,
      // Buffer.from(photoData)
      new Uint8Array(photoData)
    );
    data.photo = `/${data.photo.name}`;
  }; */
  const result = productSchema.safeParse(data);
  if(!result.success){
    return result.error.flatten();
  }else{
    const session = await getSession();
    if(session.id){
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          user: {
            connect:{
              id: session.id,
            }
          },
        },
        select:{
          id: true,
        }
      });
      redirect(`/products/${product.id}`); // or redirect(`/products`)
    }
  }
  // console.log(data);
};

export async function getUploadUrl(){
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ID}/images/v2/direct_upload`, {
    method: "POST",
    headers:{
      "Authorization": `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
    }
  });
  const data = await res.json();
  return data;
}