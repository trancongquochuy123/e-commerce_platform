"use client";

import { useState } from "react";

export default function ProductGallery({ product }) {
  const [mainImage, setMainImage] = useState(product.thumbnail);
  const galleryImages = Array.isArray(product.images) ? product.images : [];

  return (
    <div className="lg:col-span-1">
      <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-gray-100">
        <img
          src={mainImage}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {galleryImages.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div
            className="flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 transition-all hover:border-orange-500"
            onClick={() => setMainImage(product.thumbnail)}
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 transition-all hover:border-orange-500"
              onClick={() => setMainImage(image)}
            >
              <img
                src={image}
                alt={`${product.title} ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
