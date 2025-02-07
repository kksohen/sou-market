"use server";

import { getCloudVideoId } from "@/app/(tabs)/live/actions";
import db from "@/lib/db";
import getSession from "@/lib/session/get-session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// import { revalidatePath } from "next/cache";

export async function deleteStreamAction(streamId: number){
  const session = await getSession();
  const userId = session.id;
  if(!userId){
    return false;
  }

  const deleted = await db.liveStream.delete({
    where: {
      id: streamId,
    }
  });
  if(!deleted){
    return false;
  }
  revalidatePath("/live");
  redirect("/live");
  // return true;
}

export async function getReplayUrl(streamId: string){
  try{
    const videoId = await getCloudVideoId(streamId);
    // console.log(`streamId: ${streamId}, videoId: ${videoId}`);
    if(!videoId || videoId.length === 0){
      return null;
    }

    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ID}/stream/${videoId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.CLOUDFLARE_TOKEN}`
      }
    });
  
    const data = await res.json();
    // console.log(data);

    if(data.success){
      return data.result.preview;
    }
    return null;

  }catch(e){
    console.error(e);
    return null;
  }
}