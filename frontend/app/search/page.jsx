"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import ProductCard from "@/components/product-card";
import { API_URL } from "@/lib/constants";
import { Search, Loader2 } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [resultCount, setResultCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const observerTarget = useRef(null);

  // Perform initial search when URL keyword changes
  useEffect(() => {
    const urlKeyword = searchParams.get("keyword");
    if (urlKeyword) {
      setKeyword(urlKeyword);
      setProducts([]);
      setCurrentPage(1);
      setPagination(null);
      performSearch(urlKeyword, 1);
    }
  }, [searchParams]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          pagination?.hasNextPage &&
          !loadingMore &&
          !loading &&
          searchPerformed
        ) {
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
  }, [pagination, loadingMore, loading, searchPerformed]);

  const performSearch = async (searchKeyword, page = 1) => {
    if (!searchKeyword.trim()) {
      setProducts([]);
      setSearchPerformed(false);
      return;
    }

    if (page === 1) {
      setLoading(true);
    }
    setError(null);
    setSearchPerformed(true);

    try {
      const response = await fetch(
        `${API_URL}/search?keyword=${encodeURIComponent(searchKeyword)}&page=${page}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();

      if (data.success && data.data) {
        setResultCount(data.data.count || 0);

        // Map products to match ProductCard format
        const mappedProducts = data.data.products.map((product) => ({
          id: product._id,
          name: product.title,
          href: `/products/${product.slug}`,
          price: product.priceNew
            ? `$${product.priceNew}`
            : `$${product.price}`,
          originalPrice: product.priceNew ? `$${product.price}` : null,
          imageSrc: product.thumbnail,
          imageAlt: product.title,
          category: product.product_category_id?.title || "Unknown",
        }));

        // Append products if loading more, otherwise replace
        if (page === 1) {
          setProducts(mappedProducts);
        } else {
          setProducts((prev) => [...prev, ...mappedProducts]);
        }

        // Update pagination info
        if (data.meta?.pagination) {
          setPagination(data.meta.pagination);
          setCurrentPage(data.meta.pagination.currentPage);
        }
      } else {
        if (page === 1) {
          setProducts([]);
          setResultCount(0);
        }
      }
    } catch (err) {
      console.error("Search error:", err);
      if (page === 1) {
        setError("Failed to load search results. Please try again.");
        setProducts([]);
        setResultCount(0);
      } else {
        setError("Failed to load more results. Please try again.");
      }
    } finally {
      if (page === 1) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  const loadMoreProducts = useCallback(() => {
    if (pagination?.hasNextPage && !loadingMore && !loading) {
      setLoadingMore(true);
      const nextPage = (currentPage || 1) + 1;
      performSearch(keyword, nextPage);
    }
  }, [pagination, loadingMore, loading, currentPage, keyword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      // Update URL and trigger search
      router.push(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          {/* Search Info */}
          {searchPerformed && !loading && (
            <div className="mt-4 text-center text-gray-600">
              {resultCount > 0 ? (
                <p>
                  Found <span className="font-semibold">{resultCount}</span>{" "}
                  {resultCount === 1 ? "product" : "products"} for &quot;
                  {searchParams.get("keyword")}&quot;
                </p>
              ) : null}
            </div>
          )}
        </div>

        {/* Initial Loading State */}
        {loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-orange-500" />
            <p className="text-gray-600">Searching...</p>
          </div>
        )}

        {/* Error State */}
        {error && products.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
              <p className="mb-2 font-medium text-red-800">Oops!</p>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && searchPerformed && resultCount === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="max-w-md text-center">
              <Search className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                No products found
              </h3>
              <p className="text-gray-600">
                We couldn&apos;t find any products matching &quot;
                {searchParams.get("keyword")}&quot;. Try searching with
                different keywords.
              </p>
            </div>
          </div>
        )}

        {/* Results Grid with Infinite Scroll */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
              {products.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                  
                </div>
              ))}
            </div>

            {/* Infinite Scroll Trigger & Loading More */}
            {pagination?.hasNextPage && (
              <div
                ref={observerTarget}
                className="mt-12 flex flex-col items-center justify-center py-8"
              >
                {loadingMore && (
                  <>
                    <Loader2 className="mb-3 h-8 w-8 animate-spin text-orange-500" />
                    <p className="text-sm text-gray-600">
                      Loading more products...
                    </p>
                  </>
                )}
              </div>
            )}

            {/* End of Results */}
            {!pagination?.hasNextPage && products.length > 0 && (
              <div className="mt-12 flex flex-col items-center justify-center py-8">
                <p className="text-center text-gray-500">
                  Showing {products.length} of {resultCount} products
                </p>
              </div>
            )}
          </>
        )}

        {/* Initial State - No search performed */}
        {!loading && !error && !searchPerformed && (
          <div className="flex flex-col items-center justify-center py-16">
            <Search className="mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Search for products
            </h3>
            <p className="text-gray-600">
              Enter a keyword above to find products
            </p>
          </div>
        )}
      </div>
    </>
  );
}
