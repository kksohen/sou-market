//modifier(hover:, dark:), 반응형  포함ㅇ
export default function Home() {
  return (
    <main className="bg-gray-100 h-screen flex items-center justify-center p-5 font-pretendard font-semibold
     dark:bg-gray-800
    ">
      <div className="bg-white w-full shadow-lg p-5 rounded-3xl 
      max-w-screen-sm dark:bg-gray-500">
      
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-gray-600 -mb-1
          dark:text-gray-300
          ">In Transit</span>
          <span className="text-4xl font-extrabold
          dark:text-white
          ">Coolblue</span>
        </div>
        <div className="size-12 rounded-full bg-orange-500"></div>
      </div>

        <div className="my-2 flex items-center gap-2">
          <span className="bg-green-500 text-white uppercase px-2.5 py-1.5 text-xs font-medium tracking-wide rounded-full
          transition
          hover:bg-green-700 hover:scale-110
          ">Today</span>
          <span className="dark:text-gray-100">9:30-10:30</span>
        </div>

        <div className="relative">
          <div className="bg-gray-200 w-full h-2 rounded-full absolute"></div>
          <div className="bg-green-500 w-2/3 h-2 rounded-full absolute"></div>
        </div>

        <div className="flex justify-between items-center mt-5 text-gray-600
        dark:text-gray-300
        ">
          <span>Expected</span>
          <span>Sorting center</span>
          <span>In transit</span>
          <span className="text-gray-400 dark:text-gray-700">Delivered</span>
        </div>
      </div>
    </main>
  );
};