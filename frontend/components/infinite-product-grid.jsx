"use client";

import { useEffect, useState, useRef } from "react";
import ProductCard from "./product-card";
import ProductGridSkeleton from "./product-grid-skeleton";

export default function InfiniteProductGrid({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading, page]);

  const loadMoreProducts = async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(
        `http://localhost:3001/api/v1/products?page=${nextPage}`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const response = await res.json();

      if (response.success && response.data) {
        const newProducts = response.data.map((product) => ({
          id: product._id,
          name: product.title,
          href: `/products/${product.slug}`,
          price: `$${product.priceNew || product.price}`,
          imageSrc: product.thumbnail,
          imageAlt: product.title,
        }));

        setProducts((prev) => [...prev, ...newProducts]);
        setPage(nextPage);
        setHasMore(response.meta?.pagination?.hasNextPage || false);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-x-4 gap-y-4 py-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 py-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square w-full rounded-lg bg-gray-200"></div>
              <div className="mt-3 h-12">
                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              </div>
              <div className="mt-1">
                <div className="h-6 w-1/3 rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Intersection observer target */}
      {hasMore && <div ref={observerTarget} className="h-10" />}

      {/* End message */}
      {!hasMore && products.length > 0 && (
        <div className="py-8 text-center text-gray-500">
          {/* No more products to load */}
        </div>
      )}
    </>
  );
}
