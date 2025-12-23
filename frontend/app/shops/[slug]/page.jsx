import Header from "@/components/header";
import InfiniteProductGrid from "@/components/infinite-product-grid";
import ProductGridSkeleton from "@/components/product-grid-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { API_URL } from "@/lib/constants";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Star } from "lucide-react";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "?";
}

function clampRating(value) {
  const ratingNumber = Number(value);
  if (!Number.isFinite(ratingNumber)) return 0;
  return Math.min(5, Math.max(0, ratingNumber));
}

async function getShopProducts(slug) {
  try {
    const safeSlug = encodeURIComponent(slug);
    const res = await fetch(`${API_URL}/shop/${safeSlug}?page=1`, {
      cache: "no-store",
    });

    if (!res.ok) {
      notFound();
    }

    const payload = await res.json();

    if (!payload?.success) {
      notFound();
    }

    const pagination = payload.meta?.pagination || null;
    const rawProducts = Array.isArray(payload.data)
      ? payload.data
      : payload.data?.products || payload.data?.items || [];
    const shopInfo =
      payload.data?.shop || payload.shop || payload.data?.seller || null;

    const products = (rawProducts || []).map((product) => ({
      id: product._id,
      name: product.title,
      href: `/products/${product.slug}`,
      price: `$${product.priceNew || product.price}`,
      imageSrc: product.thumbnail,
      imageAlt: product.title,
    }));

    return {
      shop: shopInfo,
      products,
      pagination,
    };
  } catch (error) {
    console.error("Error fetching shop products:", error);
    notFound();
  }
}

function ShopHeader({
  shop,
  totalProducts,
  totalReviews,
  rating,
  description,
}) {
  const name = shop?.name || shop?.shopName || shop?.fullName || "Shop";
  const avatar = shop?.avatar || shop?.avatarUrl || shop?.thumbnail;
  const safeRating = clampRating(rating);
  const safeReviews = Number.isFinite(Number(totalReviews))
    ? Number(totalReviews)
    : 0;

  return (
    <Card className="mt-4 mb-6 border-orange-100 bg-white/90 shadow-md">
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border border-orange-100 bg-orange-50">
            {avatar ? <AvatarImage src={avatar} alt={`${name} logo`} /> : null}
            <AvatarFallback className="text-base font-semibold text-orange-600">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">{name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="h-4 w-4"
                      fill={safeRating >= index + 1 ? "#f59e0b" : "none"}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
                <span className="font-medium text-gray-900">
                  {safeRating.toFixed(1)}
                </span>
                <span className="text-gray-500">({safeReviews} reviews)</span>
              </div>
              <span className="h-4 w-px bg-gray-200" />
              <span className="font-medium text-gray-900">{totalProducts}</span>
              <span className="text-gray-500">products</span>
            </div>
            {description ? (
              <p className="max-w-2xl text-sm text-gray-600">{description}</p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ShopProducts({ endpoint, products, hasMore }) {
  if (!products.length) {
    return (
      <div className="mt-2 mb-10 rounded-xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center">
        <p className="text-lg font-semibold text-gray-900">No products yet</p>
        <p className="mt-1 text-sm text-gray-500">
          This shop has not listed any products. Please check back soon.
        </p>
      </div>
    );
  }

  return (
    <InfiniteProductGrid
      initialProducts={products}
      endpoint={endpoint}
      initialHasMore={hasMore}
    />
  );
}

export default async function ShopPage({ params }) {
  const { slug } = await params;
  const endpoint = `${API_URL}/shop/${encodeURIComponent(slug)}`;
  const { products, pagination } = await getShopProducts(slug);
  const shop = await fetchShopInfo();

  const totalProducts = pagination?.totalItems ?? products.length;
  const rating = shop?.rating ?? shop?.averageRating ?? 0;
  const totalReviews = shop?.reviewsCount ?? shop?.totalReviews ?? 0;
  const description = shop?.description || shop?.bio || "";
  const hasMore = pagination?.hasNextPage ?? products.length > 0;

  async function fetchShopInfo() {
    try {
      const res = await fetch(`${API_URL}/user/shop/${slug}`);
      if (!res.ok) {
        throw new Error("Failed to fetch shop info");
      }
      const result = await res.json();
      if (result.success && result.data.shop) {
        return result.data.shop;
      } else {
        throw new Error(result.message || "Shop data not found");
      }
    } catch (error) {
      console.error("Error fetching shop info:", error);
    }
  }

  return (
    <>
      <Header />
      <div className="mx-auto max-w-2xl sm:px-6 lg:max-w-7xl">
        <ShopHeader
          shop={shop}
          totalProducts={totalProducts}
          totalReviews={totalReviews}
          rating={rating}
          description={description}
        />
        <Suspense fallback={<ProductGridSkeleton />}>
          <ShopProducts
            endpoint={endpoint}
            products={products}
            hasMore={hasMore}
          />
        </Suspense>
      </div>
    </>
  );
}
