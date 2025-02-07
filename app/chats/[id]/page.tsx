import ChatMessageList from "@/components/chat-message-list";
import db from "@/lib/db";
import getSession from "@/lib/session/get-session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { getChatRoomStatus, updateMessageRead } from "./actions";
// import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import ChatRouteBtn from "@/components/chat-route";
import ChatsDeleteBtn from "@/components/chat-delete";
import { formatToWon } from "@/lib/utils";

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where:{
      id
    },
    include: { //room data 받을 시 room에 해당하는 user data도 받아오기!!
      user: {
        select: {
          id: true,
          username: true,
        }
      },
      product: {
        select: {
          title: true,
          photo: true,
          price: true,
          description: true,
          userId: true
        }
      },
    }
  });

  // console.log(room);

  if(room){
    const session = await getSession();

    const canSee = Boolean(room.user.find((user)=>user.id === session.id!));
    if(!canSee){
      return null;
    }
    
    const otherUser = room.user.find((user)=>user.id !== session.id!);
    if(!otherUser){
      return null;
    }

    return {
      ...room,
      otherUser
    };
  }
  return null;
};

async function getMessages(chatRoomId: string, userId: number){
  await updateMessageRead(chatRoomId, userId);

  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      is_read: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true
        }
      }
    }
  });
  return messages;
}

/* const getCachedMessages = nextCache(getMessages, ["chat-messages"], {
  tags: ["chat-messages"]
}); */

async function getUserProfile(){
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id!
    },
    select: {
      username: true,
      avatar: true
    }
  });
  return user;
}

export type InitChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

export default async function ChatRoom({params}: {params: {id: string}}){
  const {id} = params;
  const room = await getRoom(id);
  if(!room){
    return notFound();
  }

  const session = await getSession();

  const initMessages = await getMessages(id, session.id!);
  // console.log(initMessages);
  
  const user = await getUserProfile(); //메시지 보낸 user의 username과 avatar 받아오기
  if(!user){
    return notFound();
  }

  const chatOwnerId = room.product.userId;

  const isPaymentComplete = await getChatRoomStatus(id);

  return (
    <div>
      <div className="fixed left-0 p-6 w-full flex flex-col gap-6
      backdrop-blur-md bg-neutral-900 bg-opacity-60 
      border-b border-neutral-900">

        <div className="flex flex-row items-center gap-2 text-base-100">
          <ChatRouteBtn />
          <h1 className="text-xl">{room.otherUser.username}</h1>
          <ChatsDeleteBtn chatRoomId={id}/>
        </div>
      
        <div className="flex flex-row gap-4 items-stretch">
          <Image src={`${room.product.photo}/public`} alt={room.product.title} width={64} height={64} priority className="size-16 object-cover rounded-lg"/>

          <div className="flex flex-col">
            <h2 className="text-lg">{room.product.title}</h2>
            {/* <h4>{room.product.description}</h4> */}
            <span className="text-lg tracking-wider text-secondary mt-auto">
            { isPaymentComplete ? "거래 완료": `${formatToWon(room.product.price)}원`}</span>
          </div>
        </div>
      </div>

      <ChatMessageList initMessages={initMessages} userId={session.id!}
    chatRoomId={id} username={user.username} avatar={user.avatar!}
    chatOwnerId={chatOwnerId}
    />
    </div>
  );
}