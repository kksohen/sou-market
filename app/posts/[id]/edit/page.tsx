import EditPost from "@/components/post-edit";
import db from "@/lib/db";
import { unstable_cache as nextCache } from "next/cache";
import { notFound } from "next/navigation";

type Params = Promise<{
  id: string;
}>;

async function getPost(id: number){
  const post = await db.post.findUnique({
    where:{
      id
    },
    include:{
      user: {
        select: {
          username: true,
          avatar: true,
        }
      }
    }
  });
  return post;
}

const getCachedPost = nextCache(getPost,['post-detail'],{
  tags: ['post-detail']
});

export default async function EditPosts({params}: {params : Params}){
  const {id} = await params;
  const idNumber = Number(id);
  if(isNaN(idNumber)){
    return notFound();
  }
  const post = await getCachedPost(idNumber);
  if(!post){
    return notFound();
  }

  const description = {
    ...post,
    description: post.description ?? ""
  };

  return(
    <EditPost post={description} postId={post.id} />
  );
}