import BaotaoServices from "@/components/baotao-services";
import Header from "@/components/header";
import InfiniteProductGrid from "@/components/infinite-product-grid";
import ProductGridSkeleton from "@/components/product-grid-skeleton";
import { Suspense } from "react";
import Image from "next/image";
import { API_URL } from "@/lib/constants";

async function getProducts() {
  try {
    const res = await fetch(`${API_URL}/products?page=1`, {
      cache: "no-store", // This ensures fresh data on each request
    });

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const response = await res.json();

    // Extract products from the API response and map to component format
    if (response.success && response.data) {
      return response.data.map((product) => ({
        id: product._id,
        name: product.title,
        href: `/products/${product.slug}`,
        price: `$${product.priceNew || product.price}`,
        imageSrc: product.thumbnail,
        imageAlt: product.title,
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function ProductList() {
  const products = await getProducts();
  return <InfiniteProductGrid initialProducts={products} />;
}

export default function Home() {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-2xl sm:px-6 lg:max-w-7xl">
        <BaotaoServices />
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductList />
        </Suspense>
      </div>
    </>
  );
}
