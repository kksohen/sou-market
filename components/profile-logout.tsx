"use client";

import { logOutAction } from "@/app/(tabs)/profile/[id]/actions";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function ProfileLogout(){

  async function handleLogout(e:React.MouseEvent<HTMLButtonElement>){
    e.preventDefault();
    
    const confirmed = window.confirm("로그아웃 하시겠습니까?");
    if(!confirmed){
      return;
    }

    await logOutAction();
  }

  return(
    <form>
      <button onClick={handleLogout} className="bg-neutral-800 rounded-full p-2
      text-error hover:text-neutral-800 hover:bg-error transition-colors">
        <ArrowRightStartOnRectangleIcon className="size-6 "/>
      </button>
    </form>
  );
}