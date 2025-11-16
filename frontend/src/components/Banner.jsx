import React from "react";

const Banner = () => {
  return (
    <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-[#667eea] to-[#764ba2] p-8 text-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] before:absolute before:top-[-50%] before:right-[-10%] before:h-[300px] before:w-[300px] before:rounded-full before:bg-white/10 before:content-[''] md:p-6">
      <div className="relative z-1">
        <h1 className="mb-3 text-[2.2rem] font-bold md:text-[1.6rem]">
          Welcome to Our Store
        </h1>
        <p className="mb-5 text-[1.1rem] opacity-90 md:text-[0.95rem]">
          Discover amazing products at great prices!
        </p>
        <button className="cursor-pointer rounded-[50px] border-none bg-white px-8 py-3 text-base font-semibold text-[#667eea] shadow-[0_4px_15px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]">
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default Banner;
