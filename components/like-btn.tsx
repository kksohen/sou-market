"use client";

import { dislikePost, likePost } from "@/app/posts/[id]/actions";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { startTransition, useOptimistic } from "react";

interface LikeBtnProps{
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

export default function LikeBtn({isLiked, likeCount, postId}: LikeBtnProps) {
  const [state, reducerFn] = useOptimistic({isLiked, likeCount}, (prevState, payload)=>{
    return{
      isLiked: !prevState.isLiked,
      likeCount: prevState.isLiked ? prevState.likeCount - 1 : prevState.likeCount + 1
    }
  }); //useOptimistic(params: initData, reducer modifyData) - user에게 결과를 미리 확정지어서 보여줌(좋아요 버튼 같은 것만 사용가능, 회원가입 폼 제출버튼은 유효성 확인해야 해서 불가능)

  const onClick = async()=>{
    startTransition(()=>{
      reducerFn(undefined);
    });

    if(isLiked){
      await dislikePost(postId);
    }else{
      await likePost(postId);
    }
  }

  return(
    <button onClick={onClick} 
    className={`flex items-center gap-2 
      text-sm text-primary font-medium tracking-wider 
      border border-primary rounded-full p-2 px-3 
      transition-colors
      ${state.isLiked ? "bg-primary text-primary-content animate-appear" : "hover:text-primary-content hover:bg-primary"}
      `}>
        {state.isLiked ? (<SolidHeartIcon className="size-4"/>): (<OutlineHeartIcon className="size-4"/>)}
        {state.isLiked ? (<span>{state.likeCount}</span>): (<span>하트 {state.likeCount}</span>)}
        
      </button>
  );
}