import { formatToTimeAgo } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import CommentDelete from "./comment-delete";

interface CommentListProps{
  id: number;
  payload: string;
  userId: number;
  user: {
    username: string;
    avatar: string | null;
  };
  created_at: Date;
  sessionId: number;
};

export default function CommentList({id, user, userId, payload, created_at, sessionId}: CommentListProps){
  return(
    <div key={id} className="text-base-100 flex flex-col pb-2 last:pb-0">
      <div className="flex items-center gap-4 bg-primary bg-opacity-10 pt-4 pl-4
      rounded-t-lg
      ">

        <div className="size-12 rounded-full overflow-hidden">
          {user.avatar !== null ? (<Image width={48} height={48}
          src={user.avatar} alt={user.username}></Image>): <UserIcon />}
        </div>
        
        <div className="flex flex-col">
          <span className="text-base-200">{user.username}</span>
          <span className="text-sm text-base-300 font-medium tracking-wider">{formatToTimeAgo(created_at.toString())}</span>
        </div>

        <div className="ml-auto mr-4">
          {userId === sessionId ? (
            <CommentDelete commentId={id}/>
          ):null}
        </div>
      </div>

      <div className="rounded-b-lg py-4 pl-4 bg-primary bg-opacity-10">{payload}</div>
    </div>
  );
}