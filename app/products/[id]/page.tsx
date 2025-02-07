import DeleteBtn from "@/components/delete-btn";
import getProduct from "@/lib/product/get-product";
import getSession from "@/lib/session/get-session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import { Metadata } from "next";
import { unstable_cache as nextCache } from "next/cache"; //직접 db 안쓰고 다른 api get하는 fetch함수 쓸 땐 nextCache대신 이렇게 하면 됨(ex. fetch('https://api.com', {next: {revalidate: 60, tag: ['name']}})
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import OnChatBtn from '../../../components/chat-onclick';
import { getChatRoomStatus } from "@/app/chats/[id]/actions";
import { getExistChatRoom } from "./actions";

const getCachedProduct = nextCache(getProduct, ['product-detail'], {
  tags: ['product-detail'], //cache tag들 공유 가능(ex.같은 tag가진 cache들 모두 새로고침ㅇ)
});
/* const revalidate = async()=>{
  "use server";
  revalidateTag('product-detail'); //product-detail이라는 tag를 가진 cache만 새로고침ㅇ
} */

export async function generateMetadata({params}: {params: {id: string}}):Promise<Metadata>{
  const {id} = await params;
  const idNumber = Number(id);
  if(isNaN(idNumber)){
    return {
      title: "게시글을 찾을 수 없습니다."
    };
  }
  const product = await getCachedProduct(idNumber);
  if(!product){
    return {
      title: "게시글을 찾을 수 없습니다."
    };
  }

  return {
    title: `${product.title}`
  };
}

async function getIsOwner(userId: number){
  const session = await getSession(); //cookie에 저장된 session을 가져오기 때문에 미리 render 불가능 -> dynamic page
  if(session.id){
    return session.id === userId; //로그인한 사용자의 id와 게시물의 userId가 같은지 확인
  };
  return false;
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  //[id]가 오직 숫자만 받기 때문에 isNaN을 사용하여 숫자가 아닌 경우 404 페이지로 이동
  const {id} = await params;
  // console.log("Received Product ID:", id);

  const idNumber = Number(id);
  if(isNaN(idNumber)){
    return notFound();
  }
  const product = await getCachedProduct(idNumber);
  if(!product){
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);

  // console.log("Calling getChatRoomStatus with ID:", id);
  const existChatRoom = await getExistChatRoom(product.userId, product.id);
  let roomStatus = false;

  if(existChatRoom){
    roomStatus = await getChatRoomStatus(existChatRoom.id); 
  }


  return(
    <div>
      <div className="relative aspect-square">
        <Image fill 
        src={`${product.photo}/public`} alt={product.title} priority className="object-cover"/>
        {/* src={`${product.photo}/public`} */}
      </div>

      <div className="p-4 flex items-center gap-4 border-b border-neutral-600">
        <div className="size-14 rounded-full overflow-hidden">
          {product.user.avatar !== null ? (<Image src={product.user.avatar} width={56} height={56} alt={product.user.username} />) : (<UserIcon/>)}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>

      <div className="p-4 pb-80">
        <h1 className="text-2xl leading-10 ">{product.title}</h1>
        <p className="text-base-300 break-words">{product.description}</p>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-6 pb-10 flex justify-between items-center backdrop-blur-sm bg-base-content/70 ">
        <span className="text-xl text-base-100 tracking-wider">{formatToWon(product.price)}원</span>
        <div className="flex gap-5">
          {
            isOwner ? (
            <Link href={`/products/${product.id}/edit`} className="
            px-6 py-3 bg-primary text-primary-content font-bold rounded-lg hover:bg-accent transition-colors">수정하기</Link>
            ):(
            <OnChatBtn product={product} isPaymentComplete={roomStatus}
            />
            )
          }

          {isOwner ? (<DeleteBtn productId={product.id}/>) : null}
        </div>
      </div>
    </div>
  );
}

//export const dynamicParams = true; build 후 db 추가시 처음엔 dynamic page로 보여주고, 그 다음부턴 static page로 보여줌(기본 설정 true)
// revalidatePath("/products/1"); server action으로 실행ㅇ
/* 
export async function generateStaticParams(){
  const products = await db.product.findMany({
    select: {
      id: true
    }
  });
  return (
    products.map((product)=>({
      id: product.id + ""
    }))
  );
} 
//ProductDetail에서 받는 id(string)를 미리 rendering해서 보여줌, dynamic page에서 static page로 변경시켜주는 것 */