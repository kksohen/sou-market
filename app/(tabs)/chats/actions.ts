import db from "@/lib/db";
import getSession from "@/lib/session/get-session";
import { notFound } from "next/navigation";

export async function getRooms(userId: number){
  const rooms = await db.chatRoom.findMany({
    where: {
      user: {
        some: {
          id: userId
        }
      }
    },
    select: {
      id: true,
      messages: {
        take: 1, //take: 1은 1개만 가져오겠다는 뜻
        orderBy: {
          created_at: "desc"
        },
      },
      _count: {
        select: {
          messages: {
            where: {
              is_read: false,
              userId: {
                not: userId
              }
            }
          }
        }
      },
      user: {
        where: {
          id: {
            not: userId
          }
        },
        select: {
          avatar: true,
          username: true
        }
      },
      product: {
        select: {
          photo: true
        }
      }
    }
  });
  rooms.sort((a, b)=>{
    const createdAtA = a.messages[0]?.created_at || new Date(0);
    const createdAtB = b.messages[0]?.created_at || new Date(0);
    return createdAtB.getTime() - createdAtA.getTime(); //최신순으로 정렬
  });
  return rooms;
}

export async function getUser(){
  const session = await getSession();
  if(session.id){
    const user = await db.user.findUnique({
      where: {
        id: session.id
      },
      select: {
        avatar: true,
        username: true
      }
    });
    if(user) return user;
  }
  notFound();//session이 없거나, session은 있지만 user값이 없을 경우 404에러를 발생시킴(보안ㅇ)
}