"use server";

import db from "@/lib/db";
import getSession from "@/lib/session/get-session";
import { revalidatePath, revalidateTag } from "next/cache";
import { commentSchema } from "./schema";


export async function likePost (postId: number){
  
  const session = await getSession();

  try{
    await db.like.create({
      data:{
        postId,
        userId: session.id!
      }
    });
    revalidateTag(`like-status-${postId}`);
  }catch(e){
    console.error(e);
  };
}
export async function dislikePost (postId: number){
  
  try{
    const session = await getSession();
    await db.like.delete({
      where:{
        id:{
          postId,
          userId: session.id!
        }
      }
    });
    revalidateTag(`like-status-${postId}`);
  }catch(e){
    console.error(e);
  };
}

export const uploadComment = async(_: any, formData: FormData)=>{
  const data = {
    payload: formData.get("payload"),
    postId: formData.get("postId"),
  };

  // console.log(data);

  const result = commentSchema.safeParse(data);

  if(!result.success){
    return result.error.flatten();
  }else{
    try{
      const session = await getSession();
      const {id,payload,created_at,updated_at,userId,postId } = await db.comment.create({
        data:{
          payload: result.data.payload,
          post: {
            connect:{
              id: Number(result.data.postId)
            }
          },
          user: {
            connect:{
              id: session.id
            }
          },
        }
      });

      revalidateTag("post-detail");
      return {id, payload, created_at, updated_at, userId, postId };
    }catch(e){
      console.error(e);
    }
  }
}

export async function deleteCommentAction(commentId: number){
  const session = await getSession();
  const userId = session.id;
  if(!userId){
    return false;
  }

  const deleted = await db.comment.delete({
    where:{
      id: commentId,
      userId
    }
  });
  if(!deleted){
    return false;
  }
  revalidatePath("/life");
  revalidateTag("post-detail");
  return true;
}

export async function deletePostAction(postId: number){
  const session = await getSession();
  const userId = session.id;
  if(!userId){
    return false;
  }
  // console.log(postId, userId);

  const deleted = await db.post.delete({
    where:{
      id: postId,
      userId
    }
  });
  if(!deleted){
    return false;
  }
  revalidatePath("/life");
  // revalidateTag("post-detail");
  return true;
}