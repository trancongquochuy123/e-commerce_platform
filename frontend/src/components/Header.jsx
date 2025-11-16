import React from "react";

const Header = () => {
  return (
    <header className="sticky top-0 z-100 bg-white py-4 text-white">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-8 px-8 md:flex-nowrap">
        {/* Logo Section */}
        <div className="header-logo">
          <h1 className="m-0 cursor-pointer text-[1.8rem] font-bold whitespace-nowrap text-[#3498db] md:text-[1.4rem]">
            ShopLogo
          </h1>
        </div>

        {/* Search Section */}
        <div className="order-3 flex w-full max-w-[800px] flex-1 gap-2 rounded-xl border-2 border-solid border-[#3498db] p-[0.15rem] md:order-0 md:w-auto">
          <input
            type="text"
            placeholder="Search for products..."
            className="flex-1 rounded border-none bg-transparent px-4 py-3 text-base outline-none md:px-4 md:py-3"
          />
          <button className="cursor-pointer rounded-[0.6rem] border-none bg-[#3498db] px-3 text-base font-semibold whitespace-nowrap text-white transition-colors duration-300 hover:bg-[#2980b9] md:px-4">
            Search
          </button>
        </div>

        {/* Login and Cart Section */}
        <div className="flex items-center gap-6">
          <button className="cursor-pointer rounded border-2 border-white bg-transparent px-6 py-3 text-base font-semibold whitespace-nowrap text-white transition-all duration-300 hover:bg-white hover:text-[#2c3e50] md:px-4 md:py-2 md:text-[0.9rem]">
            Login
          </button>
          <div className="relative flex cursor-pointer items-center p-2 transition-transform duration-200 hover:scale-110">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="absolute top-0 right-0 min-w-[18px] rounded-full bg-[#e74c3c] px-[0.4rem] py-[0.15rem] text-center text-xs font-bold text-white">
              0
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
