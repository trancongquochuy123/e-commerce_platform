import Link from "next/link";

export default function Logo() {
  return (
    <Link href={"/"}>
      <div className="m-0 cursor-pointer text-xl font-bold whitespace-nowrap text-[#ff5000] md:text-2xl lg:text-[1.8rem]">
        BaoTao
      </div>
    </Link>
  );
}
