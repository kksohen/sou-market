import db from "@/lib/db";
import { notFound } from "next/navigation";
import Image from 'next/image';
import { UserIcon } from "@heroicons/react/24/solid";
import getSession from "@/lib/session/get-session";
import LiveDelete from "@/components/live-delete";
import ReplayStream from "@/components/live-replay";

async function getStream(id: number){
  const stream = await db.liveStream.findUnique({
    where:{
      id
    },
    select: {
      title: true,
      stream_key: true,
      stream_id: true,
      userId: true,
      user: {
        select: {
          username: true,
          avatar: true
        }
      }
    }
  });
  return stream;
}

export default async function StreamDetail({params}: {params:{id: string}}){

// await new Promise(resolve => setTimeout(resolve, 40000));

  const {id} = params;
  const idNumber = Number(id);
  if(isNaN(idNumber)){
    return notFound();
  }

  const stream = await getStream(idNumber);
  if(!stream){
    return notFound();
  }
  // console.log(stream.stream_id);

  const session = await getSession();

  return (
    <div className="p-6">
      <div className="relative aspect-video">
        <iframe src={`https://${process.env.CLOUDFLARE_STREAM_DOMAIN}/${stream.stream_id}/iframe`}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        className="w-full h-full" />
      </div>

      <div className="p-6 flex items-center gap-4 border-b border-neutral-700">
        <div className="size-14 overflow-hidden rounded-full">
          {stream.user.avatar !== null ? (
            <Image src={stream.user.avatar} alt={stream.user.username} 
            width={56} height={56}></Image>
          ):(
            <UserIcon />
          )}
        </div>

        <div>
          <h3 className="text-base-200 text-lg">{stream.user.username}</h3>
        </div>

        <div className="ml-auto">
          {stream.userId === session.id! ?(
          <LiveDelete streamId={idNumber}/>) : null}
        </div>
      </div>

      <div className="p-6">
        <h1 className="text-base-100 text-xl">{stream.title}</h1>
      </div>
      
      {stream.userId === session.id! ? (
      <div className="flex flex-col gap-2
      bg-primary rounded-lg text-primary-content px-6 py-4 ">
        <div className="flex flex-col">
          <span className="font-bold">* Stream URL :</span>
          <span className="break-words block text-sm">rtmps://live.cloudflare.com:443/live/</span>
        </div>
        
        <div className="border-b border-primary-content border-dashed"/>

        <div className="flex flex-col">
          <span className="font-bold">* Secret KEY :</span>
          <span className="break-words block text-sm">{stream.stream_key}</span>
        </div>
      </div>
      ): null}

      <ReplayStream streamId={stream.stream_id} title={stream.title} />
      
    </div>
  );
}