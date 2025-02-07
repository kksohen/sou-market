import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
}
export default function ListProduct({title, price, created_at, photo, id}: ListProductProps) {
  return(
    <Link href={`/products/${id}`} className="flex gap-6">
      <div className="relative size-28 rounded-lg overflow-hidden">
        <Image src={`${photo}/width=150,height=150`} alt={title} fill className="object-cover" priority></Image>
        {/* src={`${photo}/avatar`} */}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-lg text-base-100">{title}</span>
        <span className="text-sm text-base-300 font-medium tracking-wider">{formatToTimeAgo(created_at.toString())}</span>
        <span className="text-lg text-base-100 tracking-wider">{formatToWon(price)}원</span>
      </div>
    </Link>
  )
}