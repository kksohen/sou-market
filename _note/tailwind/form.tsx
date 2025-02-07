//input ring, invalid:focus(상태들은 모두 중첩가능ㅇ)
// peer(형제요소에 영향ㅇ), has-[.peer, :invalid 등](가상클래스-자식요소에 영향ㅇ)
//반응형(tailwind는 min-width): sm, md, lg, xl, 2xl
//group-focus-within으로 input focus 여부에 따라 block, hidden으로 메시지 제어 가능ㅇ
export default function Home() {
  return (
    <main className="sm:bg-red-100
    md:bg-blue-100 lg:bg-green-100 xl:bg-yellow-100 2xl:bg-purple-100
    bg-gray-100 h-screen flex items-center justify-center p-5 font-pretendard font-semibold
    ">
      <div className="*:outline-none
      ring-2 ring-transparent transition-shadow
      has-[:invalid]:ring-red-100
      bg-white w-full shadow-lg p-5 rounded-3xl flex flex-col
      max-w-screen-sm gap-2
      md:flex-row
      ">
        <input type="email" placeholder="search here" required
        className="w-full h-10 bg-gray-200 rounded-full pl-5 py-6 
        ring-2 ring-transparent 
        focus:ring-blue-500 
        focus:ring-offset-2 transition-shadow
        placeholder:drop-shadow
         invalid:focus:ring-red-500 
          peer
        "
        ></input>
        <span className="text-red-500 hidden
        peer-invalid:block
        ">이메일은 필수형식입니다.</span>
        <button className="bg-gradient-to-tr from-cyan-500 via-yellow-400 to-blue-500 text-white py-2 rounded-full font-semibold
        active:scale-90
        transition-transform 
        md:px-5
         peer-invalid:bg-red-500
          peer-required:bg-blue-500
        ">검색</button>
      </div>
    </main>
  );
};