import db from "@/lib/db";
import getSession from "@/lib/session/get-session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon, PencilSquareIcon, UserIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import LikeBtn from "@/components/like-btn";
import CommentForm from "@/components/comment-form";
import { Metadata } from "next";
import Link from "next/link";
import PostDelete from "@/components/post-delete";

type Params = Promise<{
  id: string;
}>;

async function getPost(id: number){
  try{
    // console.log(id);
    const post = await db.post.update({//바뀐 조회수 반영해주기 위해 findUnique 대신 update 사용
    where:{
      id
    },
    data:{
      views:{
        increment: 1 //조회수 증가
      }
    }
    ,
    include:{
      user: {
        select: {
          username: true,
          avatar: true
        }
      },
      _count:{
        select:{
          comments: true,
          // likes: true
        }
      },
      comments: {
        select: {
          id: true,
          payload: true,
          userId: true,
          created_at: true,
          user: {
            select: {
              username: true,
              avatar: true
            }
          }
        },
      }
    },
  });
  return post;
  }catch(e){
    console.error(e);
    return null;
  }
}

async function getLikeStatus(postId: number, userId: number){
  // const session = await getSession();
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        // userId: session.id!
        userId
      }
    }
  });
  const likeCount = await db.like.count({
    where: {
      postId
    }
  });
  return {isLiked:Boolean(isLiked),
    likeCount};
}

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
  revalidate: 60
});

async function getCachedLikeStatus(postId: number){
  const session = await getSession();
  const userId = session.id;
  const cachedOperation = nextCache(getLikeStatus, ["pro-like-status"], {
    tags: [`like-status-${postId}`],
    // revalidate: 60
  });
  return cachedOperation(postId, userId!);
}

export async function generateMetadata({params}: {params : Params}):Promise<Metadata>{
  const {id} = await params;
  const idNumber = Number(id);
  if(isNaN(idNumber)){
    return {
      title: "게시글을 찾을 수 없습니다."
    };
  }
  const post = await getCachedPost(idNumber);
  if(!post){
    return {
      title: "게시글을 찾을 수 없습니다."
    };
  }

  return {
    title: `${post.title}`
  };
}

async function getIsOwner(userId: number){
  const session = await getSession(); 
  if(session.id){
    return session.id === userId;
  };
  return false;
}

export default async function PostDetail({params}: {params : Params}) {

  // await new Promise(resolve => setTimeout(resolve, 60000)); //loading test

  const {id} = await params;
  const idNumber = Number(id);
  if(isNaN(idNumber)){
    return notFound();
  }

  const post = await getCachedPost(idNumber);
  if(!post){
    return notFound();
  }
  // console.log(post);
  
  const {isLiked, likeCount} = await getCachedLikeStatus(idNumber);

  const session = await getSession();
  const post_user = post.user;
  const post_comments = post.comments;

  const isOwner = await getIsOwner(post.userId);

  return(
    <div className="p-6 text-base-100">
      <div className="flex flex-col gap-4 pb-4 ">
        <div className="flex items-center gap-4 border-b border-neutral-600 pb-4">
          <div className="size-14 rounded-full overflow-hidden">
            {post.user.avatar !== null ? (<Image width={56} height={56}
            src={post.user.avatar} alt={post.user.username}></Image>): <UserIcon/>}
          </div>

          <div className="flex flex-col">
            <span className="text-base-200">{post.user.username}</span>
            <span className="text-sm text-base-300 font-medium tracking-wider">{formatToTimeAgo(post.created_at.toString())}</span>
          </div>

          <div className="ml-auto flex flex-row gap-4 ">
            {isOwner ? (
              <>
              <Link href={`/posts/${post.id}/edit`} className="text-primary
                hover:text-accent transition-colors">
                <PencilSquareIcon className="size-6"/>
              </Link>
          
              <PostDelete postId={post.id}/>
              </>
            )
            : null}
          </div>
        </div>
        
        <div className="pb-8">
          <h2 className="text-2xl leading-10">{post.title}</h2>
          <p className="text-base-300">{post.description ?? ""}</p>
        </div>
        
        <div className="flex flex-col gap-4 items-start border-b border-dashed border-neutral-600 pb-4">
          <div className="flex items-center gap-2 text-sm text-base-300 font-medium tracking-wider">
            <EyeIcon className="size-4"/>
            <span>조회수 {post.views}</span>
          </div>
          
            <LikeBtn isLiked={isLiked} likeCount={likeCount} postId={idNumber}/>
        </div>
      </div>

      <div>
        <CommentForm id={idNumber} sessionId={session.id!} comments={post_comments} user={post_user} />
      </div>
      
    </div>
  );
}