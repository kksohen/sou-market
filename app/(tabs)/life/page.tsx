import db from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import { ChatBubbleBottomCenterIcon, HeartIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export const metadata = {
  title: 'SOK Life',
};

async function getPosts(){
  // await new Promise(resolve=>setTimeout(resolve, 60000));
  const posts = await db.post.findMany({
    select:{
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      _count: {//좋아요, 댓글 갯수 가져오기
        select: {
          comments: true,
          likes: true
        }
      }
    },
    orderBy:{
      created_at: 'desc'
    }
  });
  return posts;
}

export default async function Life() {
  const posts = await getPosts();
  // console.log(posts);

  return (
    <>
    <div className="p-6 flex flex-col">
      {posts.map((post)=>(
        <Link href={`/posts/${post.id}`} key={post.id}
        className="pb-4 mb-4 border-b border-neutral-700 text-base-200
        flex flex-col gap-2 last:pb-0 last:border-b-0
        "
        >
          <h2 className="text-lg text-base-100">{post.title}</h2>
          <p>{post.description}</p>
          
          <div className="flex items-center justify-between text-sm text-base-300 font-medium tracking-wider">
            <div className="flex items-center gap-2">
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
              <span>·</span>
              <span>조회 {post.views}</span>
            </div>

            <div className="flex gap-4 items-center
            *:flex *:gap-1 *:items-center text-primary
            ">
              <span>
                <HeartIcon className="size-4"/>
                {post._count.likes}
              </span>
              <span>
                <ChatBubbleBottomCenterIcon className="size-4"/>
                {post._count.comments}
              </span>
            </div>
          </div>
          
        </Link>
      ))}
    </div>

    <Link href="/life/add" className="fixed right-6 bottom-24
    flex items-center justify-center p-3 bg-primary text-primary-content 
    rounded-full hover:bg-accent transition-all
    hover:rotate-180 duration-200 
    ">
      <PlusIcon className="size-6" />
    </Link>
    </>
  );
}