"use client";

import { useEffect, useRef, useState } from "react";
import ListStream from "./list-stream";
import { getMoreLives, InitStreams } from "@/app/(tabs)/live/actions";

interface LiveListProps {
  initStreams: InitStreams;
}

export default function LiveList({initStreams}: LiveListProps){
  const [streams, setStreams] = useState(initStreams);
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setLastPage] = useState(false);

  const trigger = useRef<HTMLSpanElement>(null);

  useEffect(()=>{
    const observer = new IntersectionObserver(
      async (entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      )=>{
        const el = entries[0];
        if(el.isIntersecting && trigger.current){
          observer.unobserve(trigger.current);
          setLoading(true);

          const newLives = await getMoreLives(page + 1);
          if(newLives.length !== 0){

            setPage(prev => prev + 1);
            setStreams(prev => [...prev, ...newLives]);
          }else{
            setLastPage(true);
          };
          setLoading(false);
        }
      }, {
        threshold: 1,
        rootMargin: "0px 0px -100px 0px",
      }
    );
    if(trigger.current){
      observer.observe(trigger.current);
    };
    return()=>{
      observer.disconnect();
    };
  }, [page]);

  return(
    <div className="p-6 flex flex-col gap-6">
      {streams.map((stream)=>(
        <ListStream key={stream.id} {...stream} thumbnail={stream.thumbnail}></ListStream>
      ))}

      {!isLastPage ? <span ref={trigger}
      className="px-6 py-3 bg-primary text-primary-content font-bold rounded-lg hover:bg-accent transition-colors text-center cursor-pointer"
      >
        {isLoading ? "Loading...":"Load More"}
      </span>
      : null}
    </div>
  );
}