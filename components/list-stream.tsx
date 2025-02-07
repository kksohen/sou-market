import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

interface ListStreamProps{
  title: string;
  id: number;
  thumbnail: string;
  user: {
    username: string;
    avatar: string | null;
  }
}

export default function ListStream({title, id, thumbnail, user}: ListStreamProps){

  return(
    <Link href={`/streams/${id}`} className="flex gap-6">
      
      <div className="relative rounded-lg overflow-hidden">
        {thumbnail ? (<Image priority src={thumbnail} alt={title} className="object-cover" width={199} height={112}/>) : 
        (<div className="bg-neutral-700 size-28"/>)}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-lg text-base-100">{title}</span>

        <div className="flex flex-row gap-2 items-center">

          <div className="size-6 overflow-hidden rounded-full">
          {user.avatar !== null ? (<Image priority width={24} height={24}
            src={user.avatar} alt={user.username}/>): <UserIcon />}
          </div>

          <span className="text-sm text-base-300">{user.username}</span>

        </div>
      </div>
    </Link>
  )
}