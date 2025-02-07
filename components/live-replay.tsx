"use client";

import { getReplayUrl } from "@/app/streams/[id]/actions";
import { useEffect, useState } from "react";

interface ReplayStreamProps{
  streamId: string;
  title: string;
}
export default function ReplayStream({streamId, title}: ReplayStreamProps) {
  const [replayUrl, setReplayUrl] = useState(null);

  useEffect(()=>{
    async function fetchReplayUrl(){
      const url = await getReplayUrl(streamId);
      setReplayUrl(url);
    }

    fetchReplayUrl();
  }, [streamId]);

  if(!replayUrl){
    return null;
  }

  return (
    <div className="bg-primary bg-opacity-10 mt-6 pb-6 rounded-lg">
      <div className="p-6">
        <h1 className="text-base-100 text-xl">Replay : {title}</h1>
      </div>

      <div className="relative aspect-video mx-6">
        <iframe
          src={replayUrl}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          className="w-full h-full" />
      </div>
    </div>
  );
}