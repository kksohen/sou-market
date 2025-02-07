"use server";

import db from "@/lib/db";
import getSession from "@/lib/session/get-session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export default async function deleteProductAction(productId: number){
  const session = await getSession();
  const userId = session.id;
  if(!userId){
    return false;
  }

  const deleted = await db.product.delete({
    where:{
      id: productId,
      userId
    }
  });
  if(!deleted){
    return false;
  }
  revalidatePath("/home");
  revalidateTag("product-detail");
  return true;
}

export const createChatroom = async(productUserId: number, productId: number) =>{
  const session = await getSession();
  const userId = session.id;
  if(!userId){
    return false;
  }
  const room = await db.chatRoom.create({
    data: {
      user: {
        connect: [
          {
            id: productUserId//product.userId
          }, {
            id: userId //session.id
          }
        ]
      },
      product: {
        connect: {
          id: productId
        }
      }
    },
    select: {
      id: true
    }
  });
  redirect(`/chats/${room.id}`);
};

export async function getExistChatRoom(productUserId: number, productId: number){
  const session = await getSession();
  const userId = session.id;
  if(!userId){
    return false;
  }

  const isExist = await db.chatRoom.findFirst({
    where: {
      productId,
      user: {
        some: {
          id: userId
        }
      }
    },
    select: {
      id: true
    }
  });
  return isExist; 
}