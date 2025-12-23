"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, X } from "lucide-react";

const Logo = () => (
  <Link href={"/"}>
    <div className="m-0 cursor-pointer text-xl font-bold whitespace-nowrap text-[#ff5000] md:text-2xl lg:text-[1.8rem]">
      BaoTao
    </div>
  </Link>
);

const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();

    const keyword = query.trim();
    if (!keyword) return;

    startTransition(() => {
      router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-busy={isPending}
      className="flex min-h-11 w-full max-w-[600px] flex-1 items-center gap-3 rounded-xl border-2 border-[#ff5000] px-2 py-1.5 transition focus-within:ring-2 focus-within:ring-orange-400 md:w-auto lg:max-w-[800px]"
      style={{ paddingRight: 10, paddingLeft: 10 }}
    >
      <Input
        id="search-input"
        type="search"
        placeholder="Search for products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={isPending}
        className="flex-1 border-none bg-transparent px-3 py-2 text-sm text-gray-800 outline-none md:px-4 md:py-3 md:text-base"
      />

      {/* Clear button */}
      {/* {query && !isPending && (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label="Clear search"
          className="rounded px-2 py-2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )} */}

      {/* Submit button */}
      <button
        type="submit"
        disabled={!query.trim() || isPending}
        aria-label="Search"
        className="rounded-lg px-4 py-3 text-[#ff5000] transition-colors hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
};

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
