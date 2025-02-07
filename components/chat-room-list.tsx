"use client";

import { InitChatRooms } from "@/app/(tabs)/chats/page";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import { SUPABASE_PUBLIC_KEY, SUPABASE_URL } from "./chat-message-list";
import Link from "next/link";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/solid";
import { formatToTimeAgo } from "@/lib/utils";

interface ChatRoomListProps {
  initChatRooms: InitChatRooms;
  user: {
    username: string;
    avatar: string | null;
  }
}

const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

export default function ChatRoomList({initChatRooms, user}: ChatRoomListProps) {
  const [chatRooms, setChatRooms] = useState(initChatRooms);
  const channels = useRef<RealtimeChannel[]>([]);

  useEffect(()=>{

    chatRooms.forEach((chatroom)=>{
      // console.log(chatroom.id);
      const channel = client.channel(`room-${chatroom.id}`).on("broadcast", {
        event: "message"
      }, (payload)=>{
        // console.log(payload);

        const newMessage = payload.payload;
        // console.log(newMessage);

        if(newMessage){//새 메시지가 있을 때 채팅방 목록 업뎃
          setChatRooms((prevChatRooms) => {
            const newChatRooms = prevChatRooms.map((chatRoom)=>
              chatRoom.id === chatroom.id ? {...chatRoom, messages: [newMessage],
                _count: {messages: chatRoom._count.messages + 1},
              } : chatRoom
            );
            newChatRooms.sort((a, b)=>{
              const createdAtA = a.messages.length > 0 ? new Date(a.messages[0].created_at).getTime() : new Date(0).getTime();
              const createdAtB = b.messages.length > 0 ? new Date(b.messages[0].created_at).getTime() : new Date(0).getTime();
              return createdAtB - createdAtA; //최신순으로 정렬
            });
            return newChatRooms;
        });
        }
      }).subscribe();

      channels.current.push(channel);
    });

    const currentChannels = channels.current;

    return ()=>{
      currentChannels.forEach((channel)=>{
        client.removeChannel(channel);
      });
    }
  }, [chatRooms]);

  return (
    <div className="p-6 flex flex-col gap-4">
      {chatRooms.map((chatRoom)=>(
        <Link href={`/chats/${chatRoom.id}`} key={chatRoom.id}
        className="border-b border-neutral-700
        pb-4">
            <div className="flex flex-row gap-4 items-start ">
              {chatRoom.user[0] === undefined ? (//상대방이 채팅방 나갔을 때
              <Image src={user.avatar!} alt={user.username} 
              width={56} height={56} priority className="rounded-full size-14"/>
              ) : chatRoom.user[0].avatar === null ? (//상대방 프로필 없을 때
                <UserIcon className="size-14"/>
              ) : (//상대방 프로필 있을 때
                <Image src={chatRoom.user[0].avatar} alt={chatRoom.user[0].username} width={56} height={56} priority className="rounded-full"/>
              )}
            
              <div className="flex flex-col flex-grow">
                <span className="text-base-100">{chatRoom.user[0]===undefined ? "나와의 채팅" : chatRoom.user[0].username}</span>

                <span className="text-base-300 text-sm">{chatRoom.messages[0]=== undefined ? "대화 내역이 없습니다." : chatRoom.messages[0].payload}</span>
              </div>

              <div className="flex flex-row flex-grow-0">
                <div className="flex flex-col items-end justify-between">
                  <span className="text-sm text-base-300">{chatRoom.messages[0]=== undefined ? null : formatToTimeAgo(chatRoom.messages[0].created_at.toString())}</span>

                  {chatRoom.messages[0] === undefined || chatRoom.messages[0].is_read ? null : (
                    <div>
                      {chatRoom._count.messages === 0 ? null : (
                      <span className="text-xs text-base-100 bg-secondary 
                      p-1 px-1.5 rounded-full">{chatRoom._count.messages}</span>)}
                    </div>
                  )}
                </div>

                <Image src={`${chatRoom.product.photo}/public`} alt={chatRoom.id} className="object-cover rounded-md size-14 ml-4" 
                width={56} height={56} priority/>
              </div>            
            </div>
        </Link>
      ))}
    </div>
  );
}