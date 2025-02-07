"use server";

import { productSchema } from "@/app/home/add/schema";
import db from "@/lib/db";
import getSession from "@/lib/session/get-session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProduct(productId:number, formData: FormData){
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  const result = productSchema.safeParse(data);
  if(!result.success){
    return result.error.flatten();
  }else{
    const session = await getSession();
    if(session.id){
      const product = await db.product.update({
        where:{
          id: productId,
        },
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
      redirect(`/products/${product.id}`);
    }
  }
};