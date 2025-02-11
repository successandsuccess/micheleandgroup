import { useRouter } from "next/router";

export const HeaderItem = ({ text, href }: { text: string; href?: string }) => {
  const router = useRouter();
  return (
    <button
      className="my-auto py-[10px] px-[5px] text-[16px] leading-[19.2px] font-medium"
      onClick={() => router.push(href || "/")}
    >
      {text}
    </button>
  );
};
