//loading skeleton page building
export default function Loading(){
  return(
    <div className="p-6 animate-pulse flex flex-col gap-4">
      {[...Array(10)].map((_, index)=>(
        <div key={index} className="border-b border-neutral-700
        pb-4">
          <div className="flex flex-row gap-4 items-start">
            <div className="rounded-full size-14 bg-neutral-700"></div>

            <div className="flex flex-col flex-grow *:h-4 gap-2 *:bg-neutral-700 *:rounded-full">
              <div className="w-16"></div>
              <div className="w-28"></div>
            </div>

            <div className="flex flex-row flex-grow-0">
              <div className="flex flex-col items-end justify-between">
                <div className="h-4 w-10 bg-neutral-700 rounded-full"></div>

                  <div className="size-4 bg-neutral-700 rounded-full"></div>
              </div>

              <div className="rounded-md size-14 ml-4 bg-neutral-700"></div>
            </div>
          </div>
      </div>
      ))}
    </div>
  )
}