"use server";

import db from "@/lib/db";
import getSession from "@/lib/session/get-session";
import { redirect } from "next/navigation";
import { profileSchema } from "./edit/schema";
import bcrypt from 'bcrypt';
import { revalidatePath, revalidateTag } from "next/cache";

export async function logOutAction(){
    const session = await getSession();
    session.destroy();
    redirect("/");
}

export async function getUserInfo(id: number){
  const user = await db.user.findUnique({
    where: {
      id
    },
    select: {
      avatar: true,
      username: true,
      email: true,
      // password: true,
      phone: true,
      id: true,
    },
  });
  
  return user;
}

export async function updateProfile(userId:number, formData: FormData){
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
    phone: formData.get("phone"),
    avatar: formData.get("avatar"),
  };

  console.log(data);

  const result = await profileSchema.spa(data);
  if(!result.success){
    return result.error.flatten();
  }else{
    const session = await getSession();
    if(session.id){
      let hashedPassword;
      if(result.data.password){
        hashedPassword =  await bcrypt.hash(result.data.password, 12);
      }

      await db.user.update({
        where:{
          id: userId,
        },
        data: {
          username: result.data?.username,
          email: result.data?.email,
          phone: result.data?.phone,
          password: hashedPassword || undefined,
          avatar: result.data?.avatar || undefined,
        },
        select:{
          id: true,
        }
      });
      revalidatePath("/profile");
      revalidateTag("profile-detail");
      // redirect(`/profile/${profile.id}`);
      redirect(`/profile`);
    }
  }
};

export const checkUsernameAvailability = async(username: string)=>{
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    }
  });
  return user ? true : false;
}
export const checkEmailAvailability = async(email: string)=>{
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true
    }
  });
  return user ? true : false;
}
export const checkPhoneAvailability = async(phone: string)=>{
  const user = await db.user.findUnique({
    where: {
      phone,
    },
    select: {
      id: true
    }
  });
  return user ? true : false;
}