"use client";

import { HomeIcon as SolidHomeIcon, NewspaperIcon as SolidNewspaperIcon, ChatBubbleOvalLeftEllipsisIcon as SolidChatBubbleOvalLeftIcon, VideoCameraIcon as SolidVideoCameraIcon, UserIcon as SolidUserIcon } from "@heroicons/react/24/solid";
import { HomeIcon as OutlineHomeIcon, NewspaperIcon as OutlineNewspaperIcon, ChatBubbleOvalLeftEllipsisIcon as OutlineChatBubbleOvalLeftIcon, VideoCameraIcon as OutlineVideoCameraIcon, UserIcon as OutlineUserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar(){
  const pathname = usePathname();
  return(
    <div className="fixed bottom-0 w-full mx-0 max-w-screen-sm grid grid-cols-5
    border-neutral-600 border-t px-4 py-2 *:text-base-300
    backdrop-blur-lg
    ">
      <Link href="/home" className="flex flex-col items-center gap-px">
        {pathname === "/home" || pathname.startsWith("/products") ? <SolidHomeIcon className="w-7 h-7"/>: <OutlineHomeIcon className="w-7 h-7"/>}
        <span>홈</span>
      </Link>
      <Link href="/life" className="flex flex-col items-center gap-px">
        {pathname === "/life" ? <SolidNewspaperIcon className="w-7 h-7"/>: <OutlineNewspaperIcon className="w-7 h-7"/>}
        <span>쏙라이프</span>
      </Link>
      <Link href="/chats" className="flex flex-col items-center gap-px">
        {pathname === "/chats" ? <SolidChatBubbleOvalLeftIcon className="w-7 h-7"/>: <OutlineChatBubbleOvalLeftIcon className="w-7 h-7"/>}
        <span>채팅</span>
      </Link>
      <Link href="/live" className="flex flex-col items-center gap-px">
        {pathname === "/live" ? <SolidVideoCameraIcon className="w-7 h-7"/>: <OutlineVideoCameraIcon className="w-7 h-7"/>}
        <span>쇼핑</span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center gap-px">
        {pathname === "/profile" ? <SolidUserIcon className="w-7 h-7"/>: <OutlineUserIcon className="w-7 h-7"/>}
        <span>프로필</span>
      </Link>
    </div>
  );
};