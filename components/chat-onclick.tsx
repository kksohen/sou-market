"use client";
import { createChatroom, getExistChatRoom } from "@/app/products/[id]/actions";
import { redirect } from "next/navigation";

interface OnChatBtnProps{
  product: {userId: number, id: number};
  isPaymentComplete: boolean;
}

export default function OnChatBtn({product, isPaymentComplete}: OnChatBtnProps){
  const onClickChat = async()=>{
    const existChatRoom = await getExistChatRoom(product.userId, product.id);

    if(existChatRoom){
      redirect(`/chats/${existChatRoom.id}`);
    }else{
      await createChatroom(product.userId, product.id);
    };  
  }

  return(
    <button onClick={onClickChat} disabled={isPaymentComplete}
    className={`px-6 py-3 font-bold rounded-lg transition-colors
    ${isPaymentComplete ? "bg-neutral-600 cursor-not-allowed" : "bg-primary text-primary-content hover:bg-accent"}
    `}>
      {isPaymentComplete ? "거래 완료" : "채팅하기"}
    </button>
  );
}