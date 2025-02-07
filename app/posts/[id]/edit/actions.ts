"use server";

import { postSchema } from "@/app/(tabs)/life/add/schema";
import db from "@/lib/db";
import getSession from "@/lib/session/get-session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function updatePostAction(postId:number, formData: FormData){
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
  };

  const result = postSchema.safeParse(data);
  if(!result.success){
    return result.error.flatten();
  }else{
    const session = await getSession();
    if(session.id){
      const post = await db.post.update({
        where:{
          id: postId,
        },
        data: {
          title: result.data.title,
          description: result.data.description,
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
      revalidatePath("/life");
      revalidateTag("post-detail");
      redirect(`/posts/${post.id}`);
    }
  }
};