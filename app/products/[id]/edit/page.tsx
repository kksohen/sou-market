/* page.tsx를 "server component"로 만들고 
이 파일이 수행하는 작업은 서버에서 가져온 product props와 함께 
<UpdatePost/>만 return할 것
나머지 "client component" 작업은 별도의 파일인 <UpdatePost/>에서 실행할 것 */
import UpdatePost from "@/components/update-post";
import getProduct from "@/lib/product/get-product";
import { unstable_cache as nextCache } from "next/cache";
import { notFound } from "next/navigation";

const getCachedProduct = nextCache(getProduct,['product-detail'],{
  tags: ['product-detail']
});

export default async function EditProducts({params}: {params: {id: string;}}){
  const {id} = await params;
  const idNumber = Number(id);
  if(isNaN(idNumber)){
    return notFound();
  }
  const product = await getCachedProduct(idNumber);
  if(!product){
    return notFound();
  }

  return(
    <UpdatePost product={product} productId={product.id} />
  );
}