"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function CloseBtn(){
  const router = useRouter();
  const onCloseModal = ()=>{
    router.back(); //click 시 뒤로가기 = modal창 닫기
  };

  return(
    <button onClick={onCloseModal}
        className="absolute right-6 top-6 p-3 
        bg-secondary text-primary-content 
        rounded-full hover:bg-error transition-all
        hover:rotate-180 duration-200 
        ">
          <XMarkIcon className="size-6"></XMarkIcon>
        </button>
  );
}