"use client";

import React, { startTransition, useActionState, useOptimistic } from "react";
import { uploadComment } from "@/app/posts/[id]/actions";
import CommentList from "./comment-list";
import CommentInput from "./comment-input";

export interface CommentFormProps{
  id: number;
  payload: string;
  userId: number;
  user: {
    username: string;
    avatar: string | null;
  };
  created_at: Date;
};

export default function CommentForm({id, sessionId, comments, user}: {
  id: number;
  sessionId: number;
  comments: CommentFormProps[];
  user: {
    username: string;
    avatar: string | null;
  }
}) {

  const [state, reducerFn] = useOptimistic(comments, (prevState, payload: CommentFormProps)=> [...prevState, payload]
  );

  const interceptAction = async(_: any, formData: FormData)=>{
    const newComment = {
      payload: formData.get("payload") as string,
      id,
      created_at: new Date(),
      userId: sessionId,
      user: {
        username: user.username,
        avatar: user.avatar
      }
    };

    // console.log(newComment);
    startTransition(()=>{
      reducerFn(newComment);
    });
    
    formData.append("postId", id.toString());
    const res = await uploadComment(_, formData);

    return res;
  }

  const [_, action] = useActionState(interceptAction, null);

  /* const handleSubmit = async(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();

    startTransition(()=>{
      action(new FormData(e.currentTarget));
    })
    
  }; */

  return (
  <div className="flex flex-col h-screen" style={{maxHeight: "calc(100vh - 25.75rem)"}}>
    {/* <Suspense fallback={<div>Loading...</div>}> */}
    <div className="overflow-y-scroll scrollbar-hidden mt-1" >
    {state.map((comment, index)=>(
      <CommentList
        key={`${comment.id}-${index}`} 
        id={comment.id} payload={comment.payload} 
        userId={comment.userId} user={comment.user} 
        created_at={comment.created_at} 
        sessionId={sessionId}/>
    ))}  
    </div>
    {/* </Suspense> */}
    
    <div className="fixed bottom-0 
    left-1/2 transform -translate-x-1/2 w-full max-w-screen-sm
    bg-primary-content bg-opacity-60 backdrop-blur-md
    ">
      <form action={action} className="px-6 py-4">
        <CommentInput name="payload" placeholder="댓글 작성하기" type="text" required/>
    </form>
  </div>
  </div>
  );
}