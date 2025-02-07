import isExistUsername from "@/lib/auth/github/isExistUsername";
import getGoogleAccessToken from "@/lib/auth/google/getGoogleAccessToken";
import getGoogleProfile from "@/lib/auth/google/getProfile";
import db from "@/lib/db";
import updateSession from "@/lib/session/update-session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest){

  const code = req.nextUrl.searchParams.get('code');
  if(!code){
    return new Response(null,{
      status: 400,
    });
  }

  const {error, access_token} = await getGoogleAccessToken(code);
  if(error){
    return new Response(null,{
      status: 400,
    });
  };

  const {id, email, name, picture: avatar_url} = await getGoogleProfile(access_token);

  const user = await db.user.findFirst({
    where: {
      OR: [
        {google_id: id + ""},
        {email},
      ]
    },
    select: {
      id: true,
    }
  });

  if(user){
    await updateSession(user.id);
    return redirect("/profile");
  }

  const isExist = await isExistUsername(name);

  const newUser = await db.user.create({
    data: {
      google_id: id + "",
      email,
      username: isExist ? `${name}-gm` : name,
      avatar: avatar_url,
    },
    select: {
      id: true,
    }
  });
  await updateSession(newUser.id);
  return redirect("/profile");
};