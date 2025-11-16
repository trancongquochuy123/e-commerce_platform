import React, { useState } from "react";

const CategorySidebar = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports & Outdoors",
    "Books",
    "Toys & Games",
    "Beauty & Health",
    "Automotive",
    "Food & Beverages",
  ];

  return (
    <aside className="flex h-full flex-col rounded-md bg-[#f8f9fa] p-2 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <ul className="m-0 flex-1 list-none p-0">
        {categories.map((category, index) => (
          <li
            key={index}
            className={`mb-1 cursor-pointer rounded px-2 py-[0.4rem] text-[0.8rem] text-[#34495e] transition-all duration-300 hover:translate-x-[5px] hover:bg-[#e8f4f8] hover:text-[#2980b9] ${
              selectedCategory === category
                ? "bg-[#3498db] font-semibold text-white"
                : "font-normal"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default CategorySidebar;
