import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-[14px] transition-all duration-300 hover:-translate-y-2">
      <div className="relative flex h-[230px] w-full items-center justify-center overflow-hidden rounded-[14px] after:pointer-events-none after:absolute after:top-0 after:left-0 after:h-full after:w-full after:bg-black/0 after:transition-colors after:duration-300 after:content-[''] hover:after:bg-black/10 md:h-[180px]">
        <img
          src={product.img || product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.15]"
        />
      </div>
      <div className="flex flex-1 flex-col p-2">
        <h3 className="m-0 mb-2 overflow-hidden text-base font-semibold text-ellipsis whitespace-nowrap text-[#2c3e50] md:text-[0.95rem]">
          {product.name}
        </h3>
        {product.category && (
          <p className="m-0 mb-4 text-[0.85rem] text-[#7f8c8d]">
            {product.category}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-[1.25rem] font-bold text-[#27ae60] md:text-[1.1rem]">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
