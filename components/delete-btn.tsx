"use client";

import deleteProductAction from "@/app/products/[id]/actions";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

interface DeleteBtnProps {
  productId: number;
}

export default function DeleteBtn({productId}: DeleteBtnProps) {
  const router = useRouter();

  async function handleDelete(){
    const confirmed = window.confirm("삭제하시겠습니까?");
    if(!confirmed){
      return;
    }

    const res = await deleteProductAction(productId);
    if(res){
      alert("삭제되었습니다.");
      router.replace("/home");
    }else{
      alert("삭제에 실패했습니다.");
    }
  }

  return (
    <button onClick={handleDelete} 
    className="p-3 bg-secondary text-primary-content 
    rounded-full hover:bg-error transition-colors">
      <TrashIcon className="size-6"/>
    </button>
  );
}