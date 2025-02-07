"use client";

import { ArrowUpCircleIcon as SolidArrowUpCircleIcon} from "@heroicons/react/24/solid";
import { ArrowUpCircleIcon as OutlineArrowUpCircleIcon} from "@heroicons/react/24/outline";
import { useFormStatus } from "react-dom";

interface CommentInputProps{
  errors?: string[];
  name: string;
  type: string;
  placeholder: string;
  required: boolean;
}

export default function CommentInput({name, errors, placeholder, type}: CommentInputProps){
  const {pending} = useFormStatus();

  return (
    <div className="relative">
      <input type={type}
      name={name} placeholder={placeholder}
      className="bg-transparent resize-none
      rounded-full focus:outline-none border-none
      ring-1 ring-neutral-600 transition
      focus:ring-2 focus:ring-primary
      w-full h-12
      "
      />
      {errors?.map((error, index)=>(
        <span key={index} className="font-medium text-error text-sm">{error}</span>
      ))}

      <button disabled={pending}
      className="rounded-full
      absolute right-1 transform -translate-y-1/2 top-1/2
      text-primary disabled:bg-neutral-600 disabled:cursor-not-allowed">{pending ? (<OutlineArrowUpCircleIcon className="size-10 "></OutlineArrowUpCircleIcon>) : (
        <SolidArrowUpCircleIcon className="size-10"></SolidArrowUpCircleIcon>
      )}</button>
    </div>
  );
};