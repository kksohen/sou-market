import Link from "next/link";
// import "@/lib/db";

export default function Home() {
  return (
    <div className="flex flex-col justify-between items-center min-h-screen p-6">
      <div className="my-auto flex flex-col items-center gap-2">
        <span className="text-9xl">👽</span>
        <h1 className="text-4xl">SOK</h1>
        <h2 className="text-2xl">마켓에 온 것을 환영해요!</h2>
      </div>

      <div className="flex flex-col items-center gap-3 w-full">
        <Link href="/create-account"
        className="primary-btn text-xl"
        >시작하기</Link>
        <div className="flex gap-2 *:font-medium">
          <span className="text-base-300">이미 계정이 있나요?</span>
          <Link href="/login"
          className="hover:underline underline-offset-4"
          >로그인</Link>
        </div>
      </div>
    </div>
  );
};