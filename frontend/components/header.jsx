import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Logo = () => (
  <Link href={"/"}>
    <div className="m-0 cursor-pointer text-xl font-bold whitespace-nowrap text-[#ff5000] md:text-2xl lg:text-[1.8rem]">
      BaoTao
    </div>
  </Link>
);

const SearchBar = () => (
  <div className="flex w-full max-w-[600px] flex-1 gap-2 rounded-xl border-2 border-[#ff5000] p-[0.15rem] md:order-0 md:w-auto lg:max-w-[800px]">
    <Input
      type="text"
      placeholder="Search for products..."
      className="flex-1 rounded border-none bg-transparent px-3 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400 md:px-4 md:py-3 md:text-base"
    />
  </div>
);

const CartIcon = () => (
  <a href="/cart">
    <div className="flex cursor-pointer items-center p-2">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-[#ff5000] md:h-6 md:w-6 lg:h-7 lg:w-7"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    </div>
  </a>
);

const UserActions = () => (
  <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
    <CartIcon />
  </div>
);

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white py-3 md:py-4 lg:py-5">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 md:flex-nowrap md:gap-6 md:px-6 lg:gap-8 lg:px-8 xl:max-w-[1600px]">
        <Logo />
        <SearchBar />
        {/* <UserActions /> */}
        <CartIcon />
      </div>
    </header>
  );
}
