import React, { useState } from "react";
import "../styles/CategorySidebar.css";

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
    <aside className="category-sidebar">
      <h2 className="sidebar-title">Categories</h2>
      <ul className="category-list">
        {categories.map((category, index) => (
          <li
            key={index}
            className={`category-item ${
              selectedCategory === category ? "active" : ""
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
