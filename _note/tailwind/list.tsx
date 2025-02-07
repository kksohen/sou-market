//empty: 비어있을 태그에 속성 지정가능ㅇ
//animate- 애니 효과ㅇ
//first, last, odd, even: nth-child 속성에 있던 것
//group: ex.부모태그 호버시 자식요소 스타일 변화ㅇ
//[]안에 원하는 값 넣을시 해당 값에 따라 스타일 적용ㅇ ex. h-[360px], bg-[#eeeeee]
export default function Home() {
  return (
    <main className="sm:bg-red-100
    md:bg-blue-100 lg:bg-green-100 xl:bg-yellow-100 2xl:bg-purple-100
    bg-gray-100 h-screen flex items-center justify-center p-5 font-pretendard font-semibold
    ">
      <div className="
      bg-white w-full shadow-lg p-5 rounded-3xl flex flex-col
      max-w-screen-sm gap-3
      ">
        {["kim", "so", "hyun", "sou", ""].map((person, index)=>(
          <div key={index} className="flex items-center gap-5 pb-4
          border-b-2 last:border-none last:pb-0
          group
          ">
            <div className="size-10 bg-blue-300 rounded-full"></div>
            <span className="
            group-hover:text-red-500
            text-lg empty:w-24 empty:h-4 empty:rounded-full empty:animate-pulse empty:bg-gray-300">{person}</span>
            <div className="size-6 bg-red-500 text-white flex items-center justify-center rounded-full
            animate-bounce relative
            ">
              <span className="z-10">{index}</span>
              <div className="size-6 bg-red-500 rounded-full absolute animate-ping" ></div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};