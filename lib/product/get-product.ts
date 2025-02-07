import db from "../db";

export default async function getProduct(id: number){
  // await new Promise(resolve => setTimeout(resolve, 10000));
  const product = await db.product.findUnique({
    where:{
      id
    },
    include:{
      user: {
        select: {
          username: true,
          avatar: true,
        }
      }
    }
  });
  // console.log(product);
  return product;
}