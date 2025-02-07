"use client";

import { deleteChatRoom } from "@/app/chats/[id]/actions";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";

interface ChatsDeleteProps {
  chatRoomId: string;
}

export default function ChatsDeleteBtn({chatRoomId}: ChatsDeleteProps) {
  // const router = useRouter();

  async function handleDelete(){
    const confirmed = window.confirm("채팅방을 나갈까요?");
    if(!confirmed){
      return;
    }

    const res = await deleteChatRoom(chatRoomId);
    if(res){
      alert("채팅방이 삭제되었습니다.");
      // router.replace("/home");
    }else{
      alert("채팅방 나가기에 실패했습니다.");
    }
  }

  return (
    <button className="ml-auto" onClick={handleDelete} >
      <EllipsisVerticalIcon className="size-8 "/>
    </button>
  );
}