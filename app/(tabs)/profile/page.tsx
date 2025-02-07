import { Suspense } from "react";
import { AdjustmentsHorizontalIcon, UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import ProfileLogout from "@/components/profile-logout";
import getSession from "@/lib/session/get-session";
import db from "@/lib/db";
import { notFound } from "next/navigation";

export const metadata = {
  title: 'Profile',
};

async function getUser(){
  const session = await getSession();
  if(session.id){
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        avatar: true,
        username: true,
        email: true,
        password: true,
        phone: true,
        id: true,
      },
    });
    if(user) return user;
  }
  notFound();//session이 없거나, session은 있지만 user값이 없을 경우 404에러를 발생시킴(보안ㅇ)
}

export default async function Profile(){
  const user = await getUser();

  return(
    <div className="p-6">
      <Suspense fallback={"안녕하세요!"}>
        <div className="flex flex-col items-center gap-4">
          <div className="overflow-hidden rounded-full size-16">
            {user.avatar !== null ? (
              <Image src={user.avatar} alt={user.username} width={64} height={64} priority className="size-16"/>) 
              : <UserIcon/>
            }
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-col items-center">
              <h1 className="text-base-300">안녕하세요!</h1>
              <h1 className="text-lg text-base-100">{user.username}</h1>
            </div>
          
            <div className="flex flex-row gap-4">
              <Link href={`/profile/${user.id}/edit`} className="bg-neutral-800 rounded-full p-2
            text-primary hover:text-neutral-800 hover:bg-primary transition-colors">
                <AdjustmentsHorizontalIcon className="size-6"/>
              </Link>
        
              <ProfileLogout />
            </div>
            
          </div>

          <div className="pt-1 border-b border-neutral-800 w-full"/>
        </div>
      </Suspense>
    </div>
  );
}