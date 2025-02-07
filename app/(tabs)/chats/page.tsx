import getSession from "@/lib/session/get-session";
// import { unstable_cache as nextCache } from "next/cache";
import { getRooms, getUser } from "./actions";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import ChatRoomList from "@/components/chat-room-list";
import { ChatToHomeBtn } from "@/components/chat-route";

export type InitChatRooms = Prisma.PromiseReturnType<typeof getRooms>;

export default async function Chats() {
  // await new Promise(resolve => setTimeout(resolve, 50000));
  
  /* const getCachedChatRooms = nextCache(getRooms, ["chatroom-list"], {
    tags: ["chatroom-list"]
  }); */

  const session = await getSession();
  const user = await getUser();
  if(!user){
    return notFound();
  }
  const initChatRooms = await getRooms(session.id!);

  return (
    <div>
      {initChatRooms.length === 0 ? (
        <div className="flex flex-col text-center gap-6 items-center justify-center h-screen -mt-12">
          <div className="text-center *:text-3xl *:text-base-200">
            <h2>지금 주민들과</h2>
            <h2>대화를 시작해보세요!</h2>
          </div>
          <ChatToHomeBtn />
        </div>
      ): (
        <ChatRoomList initChatRooms={initChatRooms} user={user}/>
      )}
      
    </div>
  );
}