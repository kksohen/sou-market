"use client";

import { getChatRoomStatus, getPaymentComplete, saveMessage, updateMessageRead } from "@/app/chats/[id]/actions";
import { InitChatMessages } from "@/app/chats/[id]/page";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon, UserIcon } from "@heroicons/react/24/solid";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

//use client에서는 .env 사용ㄴ
export const SUPABASE_PUBLIC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZibWVsdmpnbnZuYnF0cW9zanBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NzExOTAsImV4cCI6MjA1MzA0NzE5MH0.09xJvbArNvxsM_g07bR8Ny_i360Gx27JSKPPX_sCqoI";
export const SUPABASE_URL = "https://fbmelvjgnvnbqtqosjpi.supabase.co";

const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

interface ChatMessageListProps {
  initMessages: InitChatMessages;
  userId: number;
  chatRoomId: string;
  username: string;
  avatar: string;
  chatOwnerId: number;
}

export default function ChatMessageList({initMessages, userId, chatRoomId, username, avatar, chatOwnerId}: ChatMessageListProps){
  const [messages, setMessages] = useState(initMessages);
  const [message, setMessage] = useState("");
  const [isPaymentComplete, setPaymentComplete] = useState(false);
  const channel = useRef<RealtimeChannel|null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = ()=>{
    if(bottomRef.current){
      bottomRef.current.scrollIntoView({
        behavior: "smooth"
      });
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setMessage(value);
  };

  const onSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    // alert(message);
    setMessages((prevMsgs) => [...prevMsgs, {
        id: Date.now(),
        payload: message,
        is_read: false,
        created_at: new Date(),
        userId,
        user: {
            username: "string",
            avatar: "no matter",
        },
    }]);
    channel.current?.send({ //useRef로 channel을 current에 저장했기 때문에 onSubmit current로 접근할 수 있음ㅇ - send로 메시지보내면 이 정보들이 같이 전송됨
      type: "broadcast",
      event: "message", 
      payload: {
        id: Date.now(), 
        payload: message, 
        is_read: false,
        created_at: new Date(), 
        userId,
        user: {
          username,
          avatar,
      },
      }
    });
    await saveMessage(message, chatRoomId);
    setMessage("");
  };

  useEffect(()=>{
    const latestMessageAsRead = async(latestMessageId: number)=>{
      await updateMessageRead(chatRoomId, userId);
    };

    const sendMessages = ()=>{
      channel.current?.send({
        type: "broadcast",
        event: "message-receipt",
        payload: {}
      });
    };
    
    sendMessages();
    
    channel.current = client.channel(`room-${chatRoomId}`);

    if(channel.current){
      channel.current.on("broadcast", {event: "message"}, (payload)=>{
        // console.log(payload);
        //setMessages(prevMsgs => [...prevMsgs, payload.payload]);
        const newMessage = payload.payload;
        setMessages((prevMsgs)=> [...prevMsgs, newMessage]);
        latestMessageAsRead(newMessage.id);
        sendMessages();
      }).on("broadcast", {event: "message-receipt"}, ()=>{
        setMessages((prevMsgs)=>{
          if(prevMsgs.length === 0) return prevMsgs;
          return prevMsgs.map((msg, index)=>
            index === prevMsgs.length -1 ? {...msg, is_read : true} : msg
          );
        });
      })
      .subscribe();
      //참고로 event는 message말고도 supabase에 더 많이 있음
    }

    return ()=>{
      if(channel.current){
        channel.current?.unsubscribe(); //user가 채팅창 떠나면 user의 subscribe도 취소ㅇㅇ
      };
    }
  }, [chatRoomId, userId]);

  useEffect(()=>{
    if(messages.length > 0){
      const latestMessage = messages[messages.length -1];
      if(userId === latestMessage.userId){
        scrollToBottom();
      }
    }
  },[messages, userId]);

  useEffect(()=>{
    const paymentStatus = async()=>{
      const status = await getChatRoomStatus(chatRoomId);
      setPaymentComplete(status);
    };

    paymentStatus();
  }, [chatRoomId]);

  const handlePaymentComplete = async()=>{
    await getPaymentComplete(chatRoomId);
    setPaymentComplete(true);
  };
  
  return(
    <div className="flex flex-col p-6 gap-4 min-h-screen justify-end">

      {messages.map((message, index)=>(
        <div key={message.id} className={`flex gap-2 items-start
        ${message.userId === userId ? "justify-end" : ""}
        `}>
          {message.userId === userId ? null : message.user.avatar !== null ? (
            <Image src={message.user.avatar} alt={message.user.username}
              className="rounded-full size-11" width={44} height={44} />
            ) : (<UserIcon className="size-11"/>)
          }

          <div className={`flex flex-col gap-1 ${message.userId === userId ? "items-end" : ""}`}>
            <div className={`flex flex-row items-center gap-1.5 ${message.userId === userId ? "" : "flex-row-reverse"} ${index === messages.length - 1 ? "justify-between" : "justify-end"}`}>
              {index === messages.length -1 && message.userId === userId &&(
                <span className="text-sm text-base-300">
                  {message.is_read ? "읽음" : "읽지 않음"}
                </span>
              )}
              <span className={`rounded-full p-2 px-2.5 text-primary-content font-bold ${message.userId === userId ? "rounded-se-none bg-primary" : "rounded-ss-none bg-accent"}`}>{message.payload}</span>
            </div>
            
            <span className="text-sm text-base-300">{formatToTimeAgo(message.created_at.toString())}</span>
          </div>
        </div>
      ))}

      <div ref={bottomRef}></div>

      <div className="fixed bottom-24 transform -translate-x-1/2 left-1/2
      *:bg-primary-content *:bg-opacity-30 *:backdrop-blur-md 
      *:rounded-full *:h-12 *:px-6 *:ring-1 *:transition *:font-bold">
        {isPaymentComplete ? (<button className="cursor-default
        ring-accent text-accent ">거래 완료</button>) : (
          <button onClick={handlePaymentComplete}
          className="ring-primary hover:bg-accent text-primary hover:text-primary-content hover:ring-accent">
          {userId === chatOwnerId ? "판매하기": "구매하기"}
          </button>)
        }
      </div>

      <form className="flex relative bg-transparent" onSubmit={onSubmit}>
        <input required onChange={onChange} value={message}
        type="text" name="message"
        placeholder={isPaymentComplete ? "거래가 완료된 채팅방입니다.":"Write a message..."} disabled={isPaymentComplete}
        className="bg-transparent rounded-full focus:outline-none border-none
          ring-1 ring-neutral-600 transition focus:ring-2 focus:ring-primary
          w-full h-12 disabled:cursor-not-allowed"
        ></input>
        <button disabled={isPaymentComplete}
        className="absolute right-1 transform -translate-y-1/2 top-1/2
        disabled:bg-neutral-600 disabled:cursor-not-allowed rounded-full size-10 text-primary hover:text-accent transition-colors
        disabled:hover:text-primary
        ">
          <ArrowUpCircleIcon />
        </button>
      </form>
    </div>
  );
}