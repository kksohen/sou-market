"use client";

import { InitProducts } from "@/app/(tabs)/home/page";
import ListProduct from "./list-product";
import { useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/home/actions";

interface ProductListProps {
  initProducts: InitProducts;
}

export default function ProductList({initProducts}: ProductListProps){
  const [products, setProducts] = useState(initProducts);
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setLastPage] = useState(false);

  const onLoadMoreClick = async()=>{
    setLoading(true);
    const newProducts = await getMoreProducts(page + 1);
    
    if(newProducts.length !== 0){//새 product의 길이가 0이 아닌 경우에만 페이지를 증가ㅇ
      setPage(prev => prev + 1);
      setProducts(prev => [...prev, ...newProducts]);
    }else{
      setLastPage(true);
    }
    
    setLoading(false);
  }

  //trigger: button click 방식으로 페이지를 증가시키는 함수
  return (
    <div className="p-6 flex flex-col gap-6">
      {products.map((product)=>(
        <ListProduct key={product.id} {...product} />
      ))}
      {isLastPage ? (<div className="text-center text-neutral-500">마지막 페이지입니다.</div>) : (<button onClick={onLoadMoreClick} disabled={isLoading}
      className="px-6 py-3 bg-primary text-primary-content font-bold rounded-lg hover:bg-accent transition-colors">
        {isLoading ? "Loading...":"Load More"}
      </button>)}
    </div>
  );
}