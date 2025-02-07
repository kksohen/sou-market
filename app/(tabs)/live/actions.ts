"use server";

import db from "@/lib/db";
import { Prisma } from "@prisma/client";


export async function getInitStreams (){
  const streams = await db.liveStream.findMany({
    select: {
      id: true,
      title: true,
      created_at: true,
      stream_id: true,
      user: {
        select: {
          username: true,
          avatar: true,
        }
      }
    },
    orderBy:{
      created_at: 'desc'
    },
    take: 1,
  });
  // return streams;

  const streamWithThumbnail = await Promise.all(streams.map(async (stream)=>{
    const thumbnail = await getStreamThumbnail(stream.stream_id);
    // console.log(`streamId: ${stream.stream_id}, thumbnail: ${thumbnail}`);
    return {...stream, thumbnail};
    })
  );
  return streamWithThumbnail;
}

export type InitStreams = Prisma.PromiseReturnType<typeof getInitStreams>;

export async function getMoreLives(page: number){
  const lives = await db.liveStream.findMany({
    select: {
      title: true,
      created_at: true,
      id: true,
      stream_id: true,
      user: {
        select: {
          username: true,
          avatar: true,
        }
      }
    },
    orderBy: {
      created_at: "desc",
    },
    skip: page * 1,
    take: 1,
  });
  // return lives;
  const livesWithThumbnail = await Promise.all(
    lives.map(async (live) => {
      const thumbnail = await getStreamThumbnail(live.stream_id); // 썸네일 가져오기
      return { ...live, thumbnail }; // 썸네일을 포함하여 반환
    })
  );
  return livesWithThumbnail;
}

export async function getCloudVideoId(streamId: string){
  try{
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ID}/stream?stream_id=${streamId}`, {
      method: "GET",
      headers:{
        "Authorization": `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
      }
    });
    const data = await res.json();
    // console.log(data);

    if(data.success && data.result.length > 0){
      const result = data.result.find((i:any)=>i.liveInput === streamId);
      if(result){
        return result.uid;
      }
    }
    return null;

  }catch(er){
    console.error(er);
    return null;
  }
}

export async function getStreamThumbnail(streamId: string){
  try{
    const videoId = await getCloudVideoId(streamId);
    // console.log(`streamId: ${streamId}, videoId: ${videoId}`);
    if(!videoId || videoId.length === 0){
      return null;
    }

    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ID}/stream/${videoId}`,{
      method: "GET",
      headers:{
        "Authorization": `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
      }
    });

    const data = await res.json();
    //console.log(data); //object
    if(data.success){
      return data.result.thumbnail;
    }
    return null;
  }catch(er){
    console.error(er);
    return null;
  }
}