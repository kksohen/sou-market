import getSession from "./get-session";

export default async function updateSession(id: number){
  const session = await getSession();
  session.id = id;
  await session.save();//실제 브라우저에 쿠키 저장
};