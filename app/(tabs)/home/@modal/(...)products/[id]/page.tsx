import CloseBtn from "@/components/close-btn";
import getProduct from "@/lib/product/get-product";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";
/* intercepting route(url segment): /app/(tabs)/home/(..)products/[id]/page -> 
1. (..)은 home폴더를 나가서 (tabs)는 괄호라 사실상 products와 동급, products/[id]폴더로 바로 이동 가능 
2. (...)은 최상위 root폴더(app), 절대경로(/)로 이동 가능, 현재 (..), (...) 둘 다 사용 가능
3. (.)은 현재 폴더 내(home)에서 intercept 가능
*/
type Params = Promise<{
  id: string;
}>;

export default async function Modal({params}: {params : Params}){
  // await new Promise(resolve => setTimeout(resolve, 10000)); loading test
  const {id} = await params;
  const idNumber = Number(id);
  
  if(isNaN(idNumber)){
    return notFound();
  }
  const product = await getProduct(idNumber);
  if(!product){
    return notFound();
  }

  //avatarUrl이 있으면 해당 url img로, 없으면 null로 설정
  const avatarUrl = product.user.avatar ? product.user.avatar : null;
  
  return(
    <div className="absolute z-50 w-full h-full left-0 top-0
    flex justify-center items-center
    bg-primary-content bg-opacity-60" >
      <CloseBtn />

      <div className="max-w-96 h-[70%] py-4 flex flex-col gap-4 
      bg-base-300 bg-opacity-10 backdrop-blur-sm rounded-lg
      ">
        <div className="flex flex-row items-center gap-4 px-4">
          <div className="w-14 h-14 rounded-full relative overflow-hidden">
            {avatarUrl ? (<Image src={avatarUrl} alt={product.user.username}
            className="object-cover" fill/>) : (<UserIcon/>)}
          </div>
          <h3 className="text-base-200">{product.user.username}</h3>
        </div>

        <div className="w-96 h-96 relative">
          <Image src={`${product.photo}/width=500,height=500`} alt={product.title}
          className="object-cover" fill />
        </div>

        <div className="flex flex-row justify-between
        border-b border-neutral-600 pb-4
        *:px-4">
          <h1 className="text-xl text-base-100">{product.title}</h1>
          <p className="text-xl text-error tracking-wider">{formatToWon(product.price)}원</p>
        </div>

        <div className="px-4 pb-10">
          <p className="text-base-300 break-words">{product.description}</p>
        </div>

      </div>
    </div>
  );
}