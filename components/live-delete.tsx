"use client";

import { deleteStreamAction } from "@/app/streams/[id]/actions";
import { TrashIcon } from "@heroicons/react/24/solid";

interface CommentDeleteProps {
  streamId: number;
}

export default function LiveDelete({streamId}: CommentDeleteProps) {
  // const router = useRouter();

  async function handleDelete(){
    const confirmed = window.confirm("삭제하시겠습니까?");
    if(!confirmed){
      return;
    }

    const res = await deleteStreamAction(streamId);
    if(res){
      alert("삭제되었습니다.");
      // router.replace("/home");
    }else{
      alert("삭제에 실패했습니다.");
    }
  }

  return (
    <button onClick={handleDelete}
    className="p-3 bg-secondary text-primary-content rounded-full 
    hover:bg-error transition-colors">
      <TrashIcon className="size-6"/>
    </button>
  );
}