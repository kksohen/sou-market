"use client";

import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { redirect } from "next/navigation";
// import { useRouter } from "next/router";

export default function ChatRouteBtn() {
  // const router = useRouter(); 

  const handleGoBack = () => {
    // router.replace("/chats");
    redirect("/chats");
  };

  return (
    <button onClick={handleGoBack}>
      <ChevronLeftIcon className="size-8 -ml-2"/>
    </button>
  );
}

export function ChatToHomeBtn(){
  const handleGoHome = ()=>{
    redirect("/home");
  }

  return(
    <button onClick={handleGoHome}
    className="text-primary text-xl">
      상품 둘러보러 가기
    </button>
  );
}