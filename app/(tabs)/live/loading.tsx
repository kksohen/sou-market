export default function Loading() {
  return(
    <div className="p-6 flex flex-col gap-6">
      {[...Array(10)].map((_, index)=>(
        <div key={index} className="flex gap-6">
        <div className="rounded-lg overflow-hidden bg-neutral-700 w-48 h-28">
        </div>

        <div className="flex flex-col gap-2">
          <span className="w-40 h-4 bg-neutral-700 rounded-md"></span>

          <div className="flex flex-row gap-2 items-center">
            <div className="size-6 rounded-full bg-neutral-700"></div>
            <span className="w-14 h-4 bg-neutral-700 rounded-md"></span>
          </div>
        </div>
        </div>
      ))}
    </div>
  );
}