"use client";

import { useFormStatus } from "react-dom";

interface FormBtnProps {
  // loading: boolean;
  text: string;
};

export default function FormBtn({text}: FormBtnProps) {
  const {pending} = useFormStatus();
  return (
    <button 
    disabled={pending}
    className="primary-btn py-2.5 disabled:bg-neutral-600 disabled:cursor-not-allowed">{pending ? "로딩 중..." : text}</button>
  );
}