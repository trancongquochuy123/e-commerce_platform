import React, { useState, useEffect, useRef, useCallback } from "react";
import CategorySidebar from "../components/CategorySidebar";
import ProductGrid from "../components/ProductGrid";
import Banner from "../components/Banner";
import BrandCarousel from "../components/BrandCarousel";
import ServicesSidebar from "../components/ServicesSidebar";

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const PRODUCTS_PER_PAGE = 18;
  const observerTarget = useRef(null);

  // Fetch all products initially
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://68d39cb6214be68f8c667d39.mockapi.io/products",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setAllProducts(data);
        setDisplayedProducts(data.slice(0, PRODUCTS_PER_PAGE));
        setHasMore(data.length > PRODUCTS_PER_PAGE);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Load more products
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    // Simulate loading delay for better UX
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = page * PRODUCTS_PER_PAGE;
      const endIndex = startIndex + PRODUCTS_PER_PAGE;
      const newProducts = allProducts.slice(startIndex, endIndex);

      setDisplayedProducts((prev) => [...prev, ...newProducts]);
      setPage(nextPage);
      setHasMore(endIndex < allProducts.length);
      setLoadingMore(false);
    }, 500);
  }, [allProducts, page, loadingMore, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, hasMore, loadingMore]);

  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-2">
      <div className="mb-6 grid grid-cols-1 items-stretch gap-4 md:mb-4 md:grid-cols-[1fr_2fr_1fr] md:gap-3 lg:grid-cols-[200px_1fr_200px]">
        {/* Left Column - Category Sidebar */}
        <div className="order-2 flex min-w-0 flex-col md:order-0">
          <CategorySidebar />
        </div>

        {/* Middle Column - Banner + Brand Carousel */}
        <div className="order-1 flex h-full min-w-0 flex-col gap-3 md:order-0">
          <div className="flex-[0_0_auto]">
            <Banner />
          </div>
          <div className="flex flex-1 flex-col">
            <BrandCarousel />
          </div>
        </div>

        {/* Right Column - Services */}
        <div className="order-2 flex min-w-0 flex-col md:order-0">
          <ServicesSidebar />
        </div>
      </div>

      {/* Product Grid Section */}
      <main className="min-w-0">
        {error ? (
          <div className="rounded-lg border border-[#fc8181] bg-[#fff5f5] p-8 text-center text-[#c53030]">
            <p className="mb-4 text-[1.1rem]">
              Error loading products: {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="cursor-pointer rounded border-none bg-[#e53e3e] px-6 py-3 text-base font-semibold text-white transition-colors duration-300 hover:bg-[#c53030]"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <ProductGrid products={displayedProducts} loading={loading} />
            {!loading && hasMore && (
              <div
                ref={observerTarget}
                className="flex h-[100px] w-full items-center justify-center"
              >
                {loadingMore && (
                  <div className="flex flex-col items-center gap-4 p-8">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#f3f3f3] border-t-[#3498db]"></div>
                    <p className="text-base font-semibold text-[#3498db]">
                      Loading more products...
                    </p>
                  </div>
                )}
              </div>
            )}
            {!loading && !hasMore && displayedProducts.length > 0 && (
              <div className="px-8 py-12 text-center text-[1.1rem] text-[#7f8c8d]">
                <p className="m-0">You've reached the end! 🎉</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
