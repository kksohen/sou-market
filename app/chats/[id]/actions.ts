"use server";
import db from '@/lib/db';
import getSession from '@/lib/session/get-session';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveMessage(payload: string, chatRoomId: string){
  const session = await getSession();
  await db.message.create({
    data: {
      payload,
      chatRoomId,
      userId: session.id!
    },
    select: {
      id: true,
    }
  });
}

export async function updateMessageRead(chatRoomId: string, userId: number){
  const unreadMessages = await db.message.findMany({
    where: {
      chatRoomId,
      userId: {
        not: userId
      },
      is_read: false
    }
  });

  if(unreadMessages.length > 0){
    await db.message.updateMany({
      where: {
        chatRoomId,
        userId: {
          not: userId
        },
        is_read: false
      },
      data: {
        is_read: true
      }
    });
  }
}

export async function deleteChatRoom(chatRoomId: string){
  const session = await getSession();
  const userId = session.id;
  if(!userId){
    return false;
  }

  const deleted = await db.chatRoom.deleteMany({
    where: {
      id: chatRoomId,
    }
  });

  if(!deleted){
    return false;
  }

  revalidatePath("/chats");
  revalidateTag("chat-rooms");
  redirect("/chats");
  // return true;
}

export async function getPaymentComplete(chatRoomId: string){
  await db.chatRoom.update({
    where: {
      id: chatRoomId
    },
    data: {
      status: true
    }
  });
}

export async function getChatRoomStatus(chatRoomId: string){
  const chatRoom = await db.chatRoom.findUnique({
    where: {
      id: chatRoomId
    },
    select: {
      status: true
    }
  });
  if(!chatRoom){
    return false;
  }
  return chatRoom?.status ?? false;
}