export default function Loading(){
  return(
    <div className="p-6 animate-pulse flex flex-col gap-6">
      {[...Array(10)].map((_, index)=>(
        <div key={index} className="*:rounded-lg flex gap-6 ">
          <div className="*:rounded-md flex flex-col gap-2">
            <div className="bg-neutral-700 h-4 w-20"></div>
            <div className="bg-neutral-700 h-4 w-40"></div>
          <div className="flex gap-2 *:rounded-md">
            <div className="bg-neutral-700 h-4 w-5"></div>
            <div className="bg-neutral-700 h-4 w-5"></div>
          </div>
          </div>
        </div>
      ))}
    </div>
  )
}