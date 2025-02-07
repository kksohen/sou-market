import db from "@/lib/db";

export default async function isExistEmail(email: string): Promise<boolean>{
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    }
  });
  return Boolean(user);
};