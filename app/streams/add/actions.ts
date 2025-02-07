"use server";

import { PRODUCT_MAX_LENGTH_ERROR, STREAM_TITLE_MIN_LENGTH } from "@/lib/constants";
import db from "@/lib/db";
import getSession from "@/lib/session/get-session";
import { redirect } from "next/navigation";
import { z } from "zod";

const title = z.string({
    required_error: "제목을 입력해주세요.",})
    .min(2, STREAM_TITLE_MIN_LENGTH)
    .max(15, PRODUCT_MAX_LENGTH_ERROR);

export async function startStream(_:any, formData: FormData){
  //page에서 useActionState 사용 예정
  const results = title.safeParse(formData.get("title"));
  if(!results.success){
    return results.error.flatten();
  };

  //1. cloudflare API에서 stream 생성
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ID}/stream/live_inputs`, {
    method: "POST",
    headers:{
      "Authorization": `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
    },
    body: JSON.stringify({
      meta: {
        name: results.data
      },
      recording: {
        mode: "automatic"
      }
    })
  });
  const data = await res.json();
  const session = await getSession();
  //console.log(data); uid, streamKey 경로 보기 위함
  const stream = await db.liveStream.create({
    data: {
      title: results.data,
      stream_id: data.result.uid,
      stream_key: data.result.rtmps.streamKey,
      userId: session.id!,
    },
    select: {
      id: true,
    }
  });
  redirect(`/streams/${stream.id}`);
}