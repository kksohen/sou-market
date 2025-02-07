import { Suspense } from "react";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import { getUserInfo } from "./actions";
import { Metadata } from 'next';
import { AdjustmentsHorizontalIcon, UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import ProfileLogout from "@/components/profile-logout";
import getSession from "@/lib/session/get-session";

const getCachedProfile = nextCache(getUserInfo, ['profile-detail'], {
  tags: ['profile-detail'],
})
/* 
export const metadata = {
  title: 'Profile',
}; */

export async function generateMetadata({params}: {params:{id:string}}):Promise<Metadata>{
  const {id} = await params;
  const idNum = Number(id);
  if(isNaN(idNum)){
    return {
      title: "프로필을 찾을 수 없습니다."
    };
  };
  const profile = await getCachedProfile(idNum);
  if(!profile){
    return{
      title: "프로필을 찾을 수 없습니다."
    };
  }
  return{
    title: `${profile.username}님의 프로필`
  };
}

async function getIsOwner(userId: number){
  const session = await getSession(); 
  if(session.id){
    return session.id === userId;
  };
  return false;
}

export default async function Profile({params}: {params: {id: string}}){
  const {id} = await params;
  const idNum = Number(id);
  if(isNaN(idNum)){
    return notFound();
  }
  const profile = await getCachedProfile(idNum);
  if(!profile){
    return notFound();
  }

  const isOwner = await getIsOwner(profile.id);

  //유저들 사이에서 서로의 프로필 클릭시 나오는 프로필 화면
  return(
    <div className="p-6">
      <Suspense fallback={"안녕하세요!"}>
        <div className="flex flex-col items-center gap-4">
          <div className="overflow-hidden rounded-full size-16">
            {profile.avatar !== null ? (
              <Image src={profile.avatar} alt={profile.username} width={64} height={64} priority/>) 
              : <UserIcon/>
            }
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-col items-center">
              <h1 className="text-base-300">안녕하세요!</h1>
              <h1 className="text-lg text-base-100">{profile.username}</h1>
            </div>
          
            {isOwner && (
            <div className="flex flex-row gap-4">
              <Link href={`/profile/edit`} className="bg-neutral-800 rounded-full p-2
            text-primary hover:text-neutral-800 hover:bg-primary transition-colors">
                <AdjustmentsHorizontalIcon className="size-6"/>
              </Link>
        
              <ProfileLogout />
            </div>
            )}
          </div>

          <div className="pt-1 border-b border-neutral-800 w-full"/>
        </div>
      </Suspense>
    </div>
  );
}