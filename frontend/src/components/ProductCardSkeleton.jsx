import React from "react";
import "../styles/ProductCardSkeleton.css";

const ProductCardSkeleton = () => {
  return (
    <div className="product-card-skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-info">
        <div className="skeleton-name"></div>
        <div className="skeleton-category"></div>
        <div className="skeleton-footer">
          <div className="skeleton-price"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
