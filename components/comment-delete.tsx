"use client";

import { deleteCommentAction } from "@/app/posts/[id]/actions";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

interface CommentDeleteProps {
  commentId: number;
}

export default function CommentDelete({commentId}: CommentDeleteProps) {
  // const router = useRouter();

  async function handleDelete(){
    const confirmed = window.confirm("삭제하시겠습니까?");
    if(!confirmed){
      return;
    }

    const res = await deleteCommentAction(commentId);
    if(res){
      alert("삭제되었습니다.");
      // router.replace("/home");
    }else{
      alert("삭제에 실패했습니다.");
    }
  }

  return (
    <button onClick={handleDelete} 
    className="">
      <EllipsisHorizontalIcon className="size-6"/>
    </button>
  );
}