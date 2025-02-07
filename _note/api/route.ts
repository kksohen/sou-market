//http method 처리방법

import { NextRequest } from "next/server";

export async function GET(req:NextRequest){
  console.log(req);
  return Response.json({
    ok: true,
  });
}

export async function POST(req:NextRequest){
  // req.cookies.get("");
  const data = await req.json();
  return Response.json(data);
}