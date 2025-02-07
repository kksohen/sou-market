import { PhotoIcon } from "@heroicons/react/24/solid";

export default function Loading(){
  return(
    <div className="absolute z-50 w-full h-full left-0 top-0
    flex justify-center items-center 
    bg-primary-content bg-opacity-60">

      <div className="animate-pulse max-w-96 h-[70%] p-4 flex flex-col 
      gap-4 bg-neutral-800 rounded-lg
      ">
        <div className="flex flex-row items-center gap-4 *:bg-neutral-600">
          <div className="w-14 h-14 rounded-full relative overflow-hidden">
          </div>
          <div className="h-4 w-20 rounded-md"></div>
        </div>

        <div className="w-full h-96 flex items-center justify-center">
          <PhotoIcon className="h-28 text-neutral-600"></PhotoIcon>
        </div>

        <div className="flex flex-row justify-between *:rounded-md *:h-4 *:bg-neutral-600 *:w-28">
          <div></div>
          <div></div>
        </div>

        <div className="flex flex-col gap-2 *:rounded-md *:h-4 *:bg-neutral-600">
          <div className="w-80"></div>
          <div className="w-48"></div>
        </div>

      </div>
    </div>
  );
}