import { EyeIcon } from "@heroicons/react/24/solid";

export default function Loading(){
  return(
    <div className="p-6 animate-pulse">
      <div className="flex flex-col gap-4 pb-4">
        <div className="flex items-center gap-4 border-b border-neutral-600 pb-4">
          <div className="size-14 rounded-full overflow-hidden bg-neutral-600">
          </div>

          <div className="flex flex-col gap-2 *:rounded-sm *:h-4 *:bg-neutral-600">
            <span className="w-16"></span>
            <span className="w-10"></span>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 pb-8 *:bg-neutral-600 *:rounded-sm ">
          <span className="h-7 w-40"></span>
          <span className="h-4 w-1/2"></span>
        </div>
        
        <div className="flex flex-col gap-4 items-start border-b border-dashed border-neutral-600 pb-4 text-neutral-500">
          <div className="flex items-center gap-2 ">
            <EyeIcon className="size-4"/>
            <span className="bg-neutral-600 h-4 w-10 rounded-sm"></span>
          </div>
          
          <button className="flex items-center gap-2 border border-neutral-600 rounded-full p-4 px-7"></button>
        </div>
      </div>

      <div>
      {[...Array(4)].map((_, index)=>(
        <div key={index} className="flex flex-col mb-4 bg-neutral-800 rounded-md
        p-4
        ">

          <div className="flex items-center gap-4 pb-4">
            <div className="size-12 rounded-full overflow-hidden bg-neutral-600">
            </div>

            <div className="flex flex-col gap-2 *:rounded-sm *:h-4 *:bg-neutral-600">
              <span className="w-16"></span>
              <span className="w-10"></span>
            </div>
            
        </div>

        <div className="h-4 w-1/2 bg-neutral-600 rounded-sm"></div>
      </div>
      ))}
      </div>
      
    </div>
    
  )
}