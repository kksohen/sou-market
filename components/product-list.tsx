"use client";

import { InitProducts } from "@/app/(tabs)/home/page";
import ListProduct from "./list-product";
import { useEffect, useRef, useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/home/actions";

interface ProductListProps {
  initProducts: InitProducts;
}

export default function ProductList({initProducts}: ProductListProps){
  const [products, setProducts] = useState(initProducts);
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setLastPage] = useState(false);

  const trigger = useRef<HTMLSpanElement>(null); //document.getElementById와 같은 역할ㅇ
  useEffect(()=>{
    const observer = new IntersectionObserver( 
      async (entries: IntersectionObserverEntry[], 
      observer: IntersectionObserver
    )=>{
      // console.log(entries[0].isIntersecting);
      const element = entries[0];
      if(element.isIntersecting && trigger.current){//trigger가 화면에 보이면 관찰 그만두고 페이지 +1씩 증가
        observer.unobserve(trigger.current);
        setLoading(true);

        const newProducts = await getMoreProducts(page + 1);
        if(newProducts.length !== 0){//새 product의 길이가 0이 아닌 경우에만 페이지를 증가ㅇ
          setPage(prev => prev + 1);
          setProducts(prev => [...prev, ...newProducts]);//이전 pro와 새 pro merge
        }else{
          setLastPage(true);
        };
        setLoading(false);
      }
    }, {
      threshold: 1,//0~1까지의 값, 1이 되면 trigger가 화면에 완전히 존재ㅇㅇ
      rootMargin: "0px 0px -100px 0px",//top right bottom left
    }
    );
    if(trigger.current){//trigger가 존재하면 observer를 실행
      observer.observe(trigger.current);
    };
    return ()=>{//clean up function: user가 페이지를 떠나면 observer를 제거
      observer.disconnect();
    };
  }, [page]);//page가 바뀔 때마다 다시 observer 실행

  return (
    <div className="p-6 flex flex-col gap-6">

      {products.map((product)=>(
        <ListProduct key={product.id} {...product} />
      ))}

      {!isLastPage ? <span ref={trigger}
      className="px-6 py-3 bg-primary text-primary-content font-bold rounded-lg hover:bg-accent transition-colors text-center cursor-pointer">
        {isLoading ? "Loading...":"Load More"}
      </span> 
      : null}

    </div>
  );
}