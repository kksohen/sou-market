//loading skeleton page building
export default function Loading(){
  return(
    <div className="p-6 animate-pulse flex flex-col gap-6">
      {[...Array(10)].map((_, index)=>(
        <div key={index} className="*:rounded-lg flex gap-6 ">
          <div className="bg-neutral-700 size-28 "/>

          <div className="*:rounded-md flex flex-col gap-2">
            <div className="bg-neutral-700 size-28 h-4 w-40"></div>
            <div className="bg-neutral-700 size-28 h-4 w-20"></div>
            <div className="bg-neutral-700 size-28 h-4 w-10"></div>
          </div>
      </div>
      ))}
    </div>
  )
}