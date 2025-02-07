import { PhotoIcon } from "@heroicons/react/24/solid";

export default function Loading(){
  return(
    <div className="animate-pulse p-6 flex flex-col gap-6" >
      <div className="aspect-square border-neutral-600 border-4 rounded-lg border-dashed flex items-center justify-center">
        <PhotoIcon className="h-28 text-neutral-600"></PhotoIcon>
      </div>

      <div className="flex gap-2 items-center">
        <div className="size-14 rounded-full bg-neutral-600"></div>
        <div className="*:rounded-md flex flex-col gap-2">
          <div className="h-4 w-40 bg-neutral-600"></div>
          <div className="h-4 w-20 bg-neutral-600"></div>
        </div>
      </div>

      <div className="rounded-md h-4 w-80 bg-neutral-600"></div>
    </div>
  )
}