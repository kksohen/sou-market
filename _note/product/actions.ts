"use server";

import db from "@/lib/db";

export async function getMoreProducts(page: number){
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    orderBy: {
      created_at: "desc",
    },
    skip: page * 1, //임의로 1 적은거고 실제 앱에선 실제 page 수를 넣어야함ㅇ
    take: 1, //1번째 글은 스킵하고 그 다음 글부터 1개 가져오겠다는 의미 = 2번째 글 가져옴ㅇ
  });
  return products;
}