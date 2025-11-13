import React, { useState, useEffect, useRef, useCallback } from "react";
import CategorySidebar from "../components/CategorySidebar";
import ProductGrid from "../components/ProductGrid";
import "../styles/Home.css";

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
          "https://68d39cb6214be68f8c667d39.mockapi.io/products"
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
      { threshold: 0.1 }
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
    <div className="home-container">
      <CategorySidebar />
      <main className="main-content">
        {error ? (
          <div className="error-message">
            <p>Error loading products: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <>
            <ProductGrid products={displayedProducts} loading={loading} />
            {!loading && hasMore && (
              <div ref={observerTarget} className="load-more-trigger">
                {loadingMore && (
                  <div className="loading-more">
                    <div className="spinner"></div>
                    <p>Loading more products...</p>
                  </div>
                )}
              </div>
            )}
            {!loading && !hasMore && displayedProducts.length > 0 && (
              <div className="end-message">
                <p>You've reached the end! 🎉</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
