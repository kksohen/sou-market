import LiveList from "@/components/live-list";
import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { getInitStreams } from "./actions";

export const metadata = {
  title: 'Shopping',
};

export default async function Live() {
  const initStreams = await getInitStreams();

  return (
    <div>
      <LiveList initStreams = {initStreams} ></LiveList>

      <Link href="/streams/add" className="fixed right-6 bottom-24
      flex items-center justify-center p-3 bg-primary text-primary-content 
      rounded-full hover:bg-accent transition-all
      hover:rotate-180 duration-200 
      ">
        <PlusIcon className="size-6" />
      </Link>
    </div>
  );
}