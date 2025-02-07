"use server";

// import fs from "fs/promises";
import db from "@/lib/db";
import getSession from "@/lib/session/get-session";
import { redirect } from "next/navigation";
import { productSchema } from "./schema";
import { revalidatePath, revalidateTag } from "next/cache";

export async function uploadProduct(formData: FormData){
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
      revalidatePath("/home");
      revalidateTag("product-detail");
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