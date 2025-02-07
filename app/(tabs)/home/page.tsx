import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
// import { unstable_cache as nextCache } from "next/cache";
import Link from "next/link";

export const metadata = {
  title: 'Home',
};

//unstable_cache(복잡한 계산 및 db query 실행하는 func, cache data로 사용될 [key], {options})
//static page(ex.home)에서는 nextCache 안써도 됨 <=> dynamic page(유저의 자격에 따라 내용이 다르게 보이는 페이지 ex.profile)에서는 nextCache가 유용함, "force-dynamic"과 함께 쓰이기도 함(ex.주식거래앱에서 주식정보는 실시간으로 바뀌기 때문에 force-dynamic으로 설정, user profile은 nextCache 활용)

/* const getCachedProducts = nextCache(
  getInitProducts, ['home-products'], {
    revalidate: 60, //60s
  }
); */

/* route에서 사용 - npm run build => start 시 production mode에서 작동ㅇ */
//export const revalidate = 60; //static page로 설정, 60s마다 db 변경사항 반영(추천)
//export const dynamic = "force-dynamic"; dynamic page로 설정, 새고할때마다 db 접근

async function getInitProducts() {
  /* How to loading page building 
  await new Promise(resolve => setTimeout(resolve, 10000));
   */

  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    orderBy: {
      created_at: "desc", //최신글이 맨 위로ㅇ
    },
    take: 1,
  });
  return products;
}

export type InitProducts = Prisma.PromiseReturnType<typeof getInitProducts>; //ProductList의 initProductsProps에 사용하기 위해 Prisma에게 부탁ㅇ

export default async function Products() {
  const initProducts = await getInitProducts();
  /* const revalidate = async() =>{
    "use server";
    revalidatePath('/home'); //home 밑에 있는 모든 페이지의 cache를 새로고침ㅇ, static page에서 사용
  } */
  return (
    <div>
      <ProductList initProducts={initProducts}/>
      
      {/* <form action={revalidate}><button>Revalidate</button></form> */}
      
      <Link href="/home/add" className="fixed right-6 bottom-24
      flex items-center justify-center p-3 bg-primary text-primary-content 
      rounded-full hover:bg-accent transition-all
      hover:rotate-180 duration-200 
      ">
        <PlusIcon className="size-6" />
      </Link>
    </div>
  );
}