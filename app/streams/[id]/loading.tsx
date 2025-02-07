export default function Loading(){
  return(
    <div className="p-6">
      <div className="w-full h-80 bg-neutral-700"></div>

      <div className="p-6 flex items-center gap-4 border-b border-neutral-700">
        <div className="size-14 rounded-full bg-neutral-700"></div>

        <div>
          <h3 className="h-4 w-20 rounded-sm bg-neutral-700"></h3>
        </div>

        <div className="ml-auto bg-neutral-700 size-14 rounded-full"></div>
      </div>

      <div className="p-6">
        <h1 className="h-4 w-1/2 rounded-sm bg-neutral-700"></h1>
      </div>
      
      <div className="flex flex-col gap-2 bg-neutral-800 rounded-lg px-6 py-4 ">
        <div className="flex flex-col gap-2">
          <span className="bg-neutral-700 h-4 w-28 rounded-sm"></span>
          <span className="bg-neutral-700 h-4 w-96 rounded-sm"></span>
        </div>
        
        <div className="border-b border-primary-content border-dashed"/>

        <div className="flex flex-col gap-2">
          <span className="bg-neutral-700 h-4 w-28 rounded-sm"></span>
          <span className="bg-neutral-700 h-4 w-96 rounded-sm"></span>
        </div>
      </div>

      <div className="bg-neutral-800 mt-6 pb-6 rounded-lg">
        <div className="p-6">
          <h1 className="h-4 w-1/2 rounded-sm bg-neutral-700"></h1>
        </div>

        <div className="h-80 bg-neutral-700 mx-6"></div>
      </div>
    </div>
  );
}