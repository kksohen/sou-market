"use client";

import { deletePostAction } from "@/app/posts/[id]/actions";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

interface PostDeleteProps {
  postId: number;
}

export default function PostDelete({postId}: PostDeleteProps) {
  const router = useRouter();

  async function handleDelete(){
    const confirmed = window.confirm("삭제하시겠습니까?");
    if(!confirmed){
      return;
    }

    const res = await deletePostAction(postId);
    if(res){
      alert("삭제되었습니다.");
      router.replace("/life");
    }else{
      alert("삭제에 실패했습니다.");
    }
  }

  return (
    <button onClick={handleDelete} 
    className="text-secondary hover:text-error transition-colors">
      <XCircleIcon className="size-6"/>
    </button>
  );
}